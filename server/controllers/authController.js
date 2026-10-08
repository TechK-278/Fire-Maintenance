const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const registerOrganization = async (req, res) => {
    try {
        const { organization_name, contact_person, email, phone, password, address, latitude, longitude } = req.body;

        if (!organization_name || !contact_person || !email || !phone || !password || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult] = await connection.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [email, hashedPassword, 'Organization']
            );
            const userId = userResult.insertId;

            const [orgResult] = await connection.query(
                'INSERT INTO organizations (user_id, organization_name, contact_person, phone, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, organization_name, contact_person, phone, address, Number(latitude), Number(longitude)]
            );

            await connection.commit();

            const token = jwt.sign(
                {
                    userId,
                    role: 'Organization',
                    organizationId: orgResult.insertId,
                    email,
                    name: organization_name
                },
                process.env.JWT_SECRET || 'supersecret_fire_safety_key_2026_xyz',
                { expiresIn: '7d' }
            );

            return res.status(201).json({
                message: 'Organization registered successfully.',
                token,
                user: {
                    userId,
                    role: 'Organization',
                    organizationId: orgResult.insertId,
                    email,
                    organizationName: organization_name,
                    contactPerson: contact_person,
                    phone,
                    address,
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                }
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message || 'Server error during organization registration.' });
    }
};

const registerTechnician = async (req, res) => {
    try {
        const { name, email, phone, password, address, latitude, longitude } = req.body;

        if (!name || !email || !phone || !password || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult] = await connection.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [email, hashedPassword, 'Technician']
            );
            const userId = userResult.insertId;

            const [techResult] = await connection.query(
                'INSERT INTO technicians (user_id, name, phone, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, name, phone, address, Number(latitude), Number(longitude)]
            );

            await connection.commit();

            const token = jwt.sign(
                {
                    userId,
                    role: 'Technician',
                    technicianId: techResult.insertId,
                    email,
                    name
                },
                process.env.JWT_SECRET || 'supersecret_fire_safety_key_2026_xyz',
                { expiresIn: '7d' }
            );

            return res.status(201).json({
                message: 'Technician registered successfully.',
                token,
                user: {
                    userId,
                    role: 'Technician',
                    technicianId: techResult.insertId,
                    email,
                    name,
                    phone,
                    address,
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                }
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error during technician registration.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required.' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials or role mismatch.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        let profileData = {};
        if (role === 'Organization') {
            const [orgs] = await db.query('SELECT * FROM organizations WHERE user_id = ?', [user.user_id]);
            if (orgs.length > 0) {
                profileData = {
                    organizationId: orgs[0].organization_id,
                    organizationName: orgs[0].organization_name,
                    contactPerson: orgs[0].contact_person,
                    phone: orgs[0].phone,
                    address: orgs[0].address,
                    latitude: orgs[0].latitude,
                    longitude: orgs[0].longitude
                };
            }
        } else if (role === 'Technician') {
            const [techs] = await db.query('SELECT * FROM technicians WHERE user_id = ?', [user.user_id]);
            if (techs.length > 0) {
                profileData = {
                    technicianId: techs[0].technician_id,
                    name: techs[0].name,
                    phone: techs[0].phone,
                    address: techs[0].address,
                    latitude: techs[0].latitude,
                    longitude: techs[0].longitude
                };
            }
        } else if (role === 'Admin') {
            profileData = {
                name: 'Administrator'
            };
        }

        const token = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
                email: user.email,
                ...profileData
            },
            process.env.JWT_SECRET || 'supersecret_fire_safety_key_2026_xyz',
            { expiresIn: '7d' }
        );

        return res.json({
            message: 'Login successful.',
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                role: user.role,
                ...profileData
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
};

const getMe = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const [users] = await db.query('SELECT user_id, email, role, created_at FROM users WHERE user_id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let details = null;
        if (role === 'Organization') {
            const [orgs] = await db.query('SELECT * FROM organizations WHERE user_id = ?', [userId]);
            details = orgs[0] || null;
        } else if (role === 'Technician') {
            const [techs] = await db.query('SELECT * FROM technicians WHERE user_id = ?', [userId]);
            details = techs[0] || null;
        }

        return res.json({
            user: users[0],
            details
        });
    } catch (error) {
        console.error('getMe error:', error);
        return res.status(500).json({ message: 'Server error fetching user details.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { email, phone, address, latitude, longitude, name, organization_name, contact_person } = req.body;

        if (email) {
            const [existing] = await db.query('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, userId]);
            if (existing.length > 0) {
                return res.status(400).json({ message: 'Email address is already in use by another account.' });
            }
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            if (email) {
                await connection.query('UPDATE users SET email = ? WHERE user_id = ?', [email, userId]);
            }

            let updatedProfile = {};

            if (role === 'Organization') {
                await connection.query(
                    `UPDATE organizations 
                     SET organization_name = COALESCE(?, organization_name),
                         contact_person = COALESCE(?, contact_person),
                         phone = COALESCE(?, phone),
                         address = COALESCE(?, address),
                         latitude = COALESCE(?, latitude),
                         longitude = COALESCE(?, longitude)
                     WHERE user_id = ?`,
                    [
                        organization_name || null,
                        contact_person || null,
                        phone || null,
                        address || null,
                        latitude !== undefined && latitude !== null ? Number(latitude) : null,
                        longitude !== undefined && longitude !== null ? Number(longitude) : null,
                        userId
                    ]
                );

                const [orgs] = await connection.query('SELECT * FROM organizations WHERE user_id = ?', [userId]);
                const org = orgs[0];
                updatedProfile = {
                    userId,
                    role: 'Organization',
                    organizationId: org.organization_id,
                    email: email || req.user.email,
                    organizationName: org.organization_name,
                    contactPerson: org.contact_person,
                    phone: org.phone,
                    address: org.address,
                    latitude: org.latitude,
                    longitude: org.longitude
                };
            } else if (role === 'Technician') {
                await connection.query(
                    `UPDATE technicians 
                     SET name = COALESCE(?, name),
                         phone = COALESCE(?, phone),
                         address = COALESCE(?, address),
                         latitude = COALESCE(?, latitude),
                         longitude = COALESCE(?, longitude)
                     WHERE user_id = ?`,
                    [
                        name || null,
                        phone || null,
                        address || null,
                        latitude !== undefined && latitude !== null ? Number(latitude) : null,
                        longitude !== undefined && longitude !== null ? Number(longitude) : null,
                        userId
                    ]
                );

                const [techs] = await connection.query('SELECT * FROM technicians WHERE user_id = ?', [userId]);
                const tech = techs[0];
                updatedProfile = {
                    userId,
                    role: 'Technician',
                    technicianId: tech.technician_id,
                    email: email || req.user.email,
                    name: tech.name,
                    phone: tech.phone,
                    address: tech.address,
                    latitude: tech.latitude,
                    longitude: tech.longitude
                };
            } else if (role === 'Admin') {
                updatedProfile = {
                    userId,
                    role: 'Admin',
                    email: email || req.user.email,
                    name: 'Administrator'
                };
            }

            await connection.commit();

            const token = jwt.sign(
                updatedProfile,
                process.env.JWT_SECRET || 'supersecret_fire_safety_key_2026_xyz',
                { expiresIn: '7d' }
            );

            return res.json({
                message: 'Profile updated successfully.',
                token,
                user: updatedProfile
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(500).json({ message: error.message || 'Server error updating profile.' });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.user;
        await db.query('DELETE FROM users WHERE user_id = ?', [userId]);
        return res.json({ message: 'Account and associated records deleted successfully.' });
    } catch (error) {
        console.error('deleteAccount error:', error);
        return res.status(500).json({ message: 'Server error deleting account.' });
    }
};

module.exports = {
    registerOrganization,
    registerTechnician,
    login,
    getMe,
    updateProfile,
    deleteAccount
};
