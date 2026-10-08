const db = require('../config/db');
const { findNearestTechnician } = require('../utils/distance');
const { sendEmail } = require('../utils/email');

const getComplaints = async (req, res) => {
    try {
        const { role, organizationId, technicianId } = req.user;
        let query = `
            SELECT 
                c.*, 
                o.organization_name, o.contact_person, o.phone as org_phone, o.address as org_address, o.latitude as org_lat, o.longitude as org_lng,
                e.equipment_type, e.model as equipment_model, e.location as equipment_location, e.status as equipment_status,
                t.task_id, t.status as task_status, t.distance, t.task_date,
                tech.technician_id, tech.name as technician_name, tech.phone as technician_phone, tech.address as tech_address
            FROM complaints c
            JOIN organizations o ON c.organization_id = o.organization_id
            JOIN equipment e ON c.equipment_id = e.equipment_id
            LEFT JOIN tasks t ON c.complaint_id = t.complaint_id
            LEFT JOIN technicians tech ON t.technician_id = tech.technician_id
        `;
        const params = [];

        if (role === 'Organization') {
            query += ' WHERE c.organization_id = ? ORDER BY c.complaint_id DESC';
            params.push(organizationId);
        } else if (role === 'Technician') {
            query += ' WHERE t.technician_id = ? ORDER BY c.complaint_id DESC';
            params.push(technicianId);
        } else {
            query += ' ORDER BY c.complaint_id DESC';
        }

        const [rows] = await db.query(query, params);
        return res.json(rows);
    } catch (error) {
        console.error('getComplaints error:', error);
        return res.status(500).json({ message: 'Server error retrieving complaints.' });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT 
                c.*, 
                o.organization_name, o.contact_person, o.phone as org_phone, o.address as org_address, o.latitude as org_lat, o.longitude as org_lng,
                e.equipment_type, e.model as equipment_model, e.location as equipment_location,
                t.task_id, t.status as task_status, t.distance, t.task_date,
                tech.technician_id, tech.name as technician_name, tech.phone as technician_phone
            FROM complaints c
            JOIN organizations o ON c.organization_id = o.organization_id
            JOIN equipment e ON c.equipment_id = e.equipment_id
            LEFT JOIN tasks t ON c.complaint_id = t.complaint_id
            LEFT JOIN technicians tech ON t.technician_id = tech.technician_id
            WHERE c.complaint_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('getComplaintById error:', error);
        return res.status(500).json({ message: 'Server error retrieving complaint.' });
    }
};

const createComplaint = async (req, res) => {
    try {
        const { role, organizationId: userOrgId } = req.user;
        let { organization_id, equipment_id, description } = req.body;

        if (role === 'Organization') {
            organization_id = userOrgId;
        }

        if (!organization_id || !equipment_id || !description) {
            return res.status(400).json({ message: 'Organization ID, equipment ID, and description are required.' });
        }

        const [orgRows] = await db.query(
            `SELECT o.*, u.email as org_email 
             FROM organizations o 
             JOIN users u ON o.user_id = u.user_id 
             WHERE o.organization_id = ?`,
            [organization_id]
        );

        if (orgRows.length === 0) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        const org = orgRows[0];

        const [eqRows] = await db.query('SELECT * FROM equipment WHERE equipment_id = ?', [equipment_id]);
        if (eqRows.length === 0) {
            return res.status(404).json({ message: 'Equipment not found.' });
        }
        const equipment = eqRows[0];

        const complaintDate = new Date().toISOString().slice(0, 10);
        const createdBy = role === 'Admin' ? 'Admin' : 'Organization';

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [complaintResult] = await connection.query(
                `INSERT INTO complaints (organization_id, equipment_id, description, complaint_date, status, created_by)
                 VALUES (?, ?, ?, ?, 'Pending', ?)`,
                [organization_id, equipment_id, description, complaintDate, createdBy]
            );

            const complaintId = complaintResult.insertId;

            const [technicians] = await connection.query(
                `SELECT t.*, u.email as tech_email 
                 FROM technicians t 
                 JOIN users u ON t.user_id = u.user_id`
            );

            const nearestTech = findNearestTechnician(org.latitude, org.longitude, technicians);
            let createdTask = null;

            if (nearestTech) {
                const [taskResult] = await connection.query(
                    `INSERT INTO tasks (complaint_id, technician_id, distance, task_date, status)
                     VALUES (?, ?, ?, ?, 'Pending')`,
                    [complaintId, nearestTech.technician_id, nearestTech.distance, complaintDate]
                );

                createdTask = {
                    task_id: taskResult.insertId,
                    complaint_id: complaintId,
                    technician_id: nearestTech.technician_id,
                    technician_name: nearestTech.name,
                    technician_phone: nearestTech.phone,
                    distance: nearestTech.distance,
                    task_date: complaintDate,
                    status: 'Pending'
                };
            }

            await connection.commit();

            if (org.org_email) {
                sendEmail({
                    to: org.org_email,
                    subject: `Complaint Registered #${complaintId}`,
                    text: `Your complaint for ${equipment.equipment_type} has been registered.${nearestTech ? ` Assigned Technician: ${nearestTech.name} (${nearestTech.distance} km).` : ''}`,
                    html: `<h3>Fire Safety Maintenance</h3><p>Complaint #${complaintId} has been registered for <strong>${equipment.equipment_type} (${equipment.model})</strong>.</p>${nearestTech ? `<p>Assigned Technician: <strong>${nearestTech.name}</strong> (Distance: ${nearestTech.distance} km, Phone: ${nearestTech.phone})</p>` : '<p>Searching for nearby technician.</p>'}`
                });
            }

            if (nearestTech && nearestTech.tech_email) {
                sendEmail({
                    to: nearestTech.tech_email,
                    subject: `New Maintenance Task #${createdTask.task_id}`,
                    text: `You have been assigned a new task for ${org.organization_name} (${nearestTech.distance} km away).`,
                    html: `<h3>New Task Assignment</h3><p>Organization: <strong>${org.organization_name}</strong></p><p>Address: ${org.address}</p><p>Equipment: ${equipment.equipment_type}</p><p>Distance: <strong>${nearestTech.distance} km</strong></p><p>Issue: ${description}</p>`
                });
            }

            return res.status(201).json({
                message: 'Complaint registered and technician assigned.',
                complaint_id: complaintId,
                task: createdTask
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('createComplaint error:', error);
        return res.status(500).json({ message: 'Server error creating complaint.' });
    }
};

module.exports = {
    getComplaints,
    getComplaintById,
    createComplaint
};
