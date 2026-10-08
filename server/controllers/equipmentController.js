const db = require('../config/db');
const { sendEmail } = require('../utils/email');

function calculateEquipmentStatus(expiryDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'Expired';
    } else if (diffDays <= 30) {
        return 'Expiring Soon';
    } else {
        return 'Valid';
    }
}

const getEquipment = async (req, res) => {
    try {
        const { role, organizationId } = req.user;
        let query = `
            SELECT e.*, o.organization_name, o.contact_person, o.phone as org_phone
            FROM equipment e
            JOIN organizations o ON e.organization_id = o.organization_id
        `;
        const params = [];

        if (role === 'Organization') {
            query += ' WHERE e.organization_id = ? ORDER BY e.equipment_id DESC';
            params.push(organizationId);
        } else {
            query += ' ORDER BY e.equipment_id DESC';
        }

        const [rows] = await db.query(query, params);

        const updatedRows = await Promise.all(
            rows.map(async (item) => {
                const computedStatus = calculateEquipmentStatus(item.expiry_date);
                if (computedStatus !== item.status) {
                    await db.query('UPDATE equipment SET status = ? WHERE equipment_id = ?', [computedStatus, item.equipment_id]);
                    item.status = computedStatus;
                }
                return item;
            })
        );

        return res.json(updatedRows);
    } catch (error) {
        console.error('getEquipment error:', error);
        return res.status(500).json({ message: 'Server error retrieving equipment.' });
    }
};

const getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT e.*, o.organization_name, o.contact_person, o.phone, o.address, o.latitude, o.longitude
             FROM equipment e
             JOIN organizations o ON e.organization_id = o.organization_id
             WHERE e.equipment_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Equipment not found.' });
        }

        const item = rows[0];
        const computedStatus = calculateEquipmentStatus(item.expiry_date);
        if (computedStatus !== item.status) {
            await db.query('UPDATE equipment SET status = ? WHERE equipment_id = ?', [computedStatus, item.equipment_id]);
            item.status = computedStatus;
        }

        return res.json(item);
    } catch (error) {
        console.error('getEquipmentById error:', error);
        return res.status(500).json({ message: 'Server error retrieving equipment details.' });
    }
};

const addEquipment = async (req, res) => {
    try {
        const { role, organizationId: userOrgId } = req.user;
        let { organization_id, equipment_type, model, issue_date, expiry_date, location } = req.body;

        if (role === 'Organization') {
            organization_id = userOrgId;
        }

        if (!organization_id || !equipment_type || !model || !issue_date || !expiry_date || !location) {
            return res.status(400).json({ message: 'All equipment fields are required.' });
        }

        const computedStatus = calculateEquipmentStatus(expiry_date);

        const [result] = await db.query(
            `INSERT INTO equipment (organization_id, equipment_type, model, issue_date, expiry_date, location, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [organization_id, equipment_type, model, issue_date, expiry_date, location, computedStatus]
        );

        return res.status(201).json({
            message: 'Equipment registered successfully.',
            equipment_id: result.insertId,
            status: computedStatus
        });
    } catch (error) {
        console.error('addEquipment error:', error);
        return res.status(500).json({ message: 'Server error adding equipment.' });
    }
};

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { equipment_type, model, issue_date, expiry_date, location } = req.body;

        if (!equipment_type || !model || !issue_date || !expiry_date || !location) {
            return res.status(400).json({ message: 'All equipment fields are required.' });
        }

        const computedStatus = calculateEquipmentStatus(expiry_date);

        await db.query(
            `UPDATE equipment 
             SET equipment_type = ?, model = ?, issue_date = ?, expiry_date = ?, location = ?, status = ?
             WHERE equipment_id = ?`,
            [equipment_type, model, issue_date, expiry_date, location, computedStatus, id]
        );

        return res.json({ message: 'Equipment updated successfully.' });
    } catch (error) {
        console.error('updateEquipment error:', error);
        return res.status(500).json({ message: 'Server error updating equipment.' });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM equipment WHERE equipment_id = ?', [id]);
        return res.json({ message: 'Equipment deleted successfully.' });
    } catch (error) {
        console.error('deleteEquipment error:', error);
        return res.status(500).json({ message: 'Server error deleting equipment.' });
    }
};

const getExpiringEquipment = async (req, res) => {
    try {
        const { role, organizationId } = req.user;
        let query = `
            SELECT e.*, o.organization_name, o.contact_person, o.phone
            FROM equipment e
            JOIN organizations o ON e.organization_id = o.organization_id
            WHERE e.status IN ('Expiring Soon', 'Expired')
        `;
        const params = [];

        if (role === 'Organization') {
            query += ' AND e.organization_id = ?';
            params.push(organizationId);
        }

        query += ' ORDER BY e.expiry_date ASC';

        const [rows] = await db.query(query, params);
        return res.json(rows);
    } catch (error) {
        console.error('getExpiringEquipment error:', error);
        return res.status(500).json({ message: 'Server error retrieving expiring equipment.' });
    }
};

const notifyEquipmentExpiry = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT e.*, o.organization_name, u.email as org_email 
             FROM equipment e
             JOIN organizations o ON e.organization_id = o.organization_id
             JOIN users u ON o.user_id = u.user_id
             WHERE e.equipment_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Equipment not found.' });
        }

        const eq = rows[0];
        if (!eq.org_email) {
            return res.status(400).json({ message: 'Organization email not found.' });
        }

        await sendEmail({
            to: eq.org_email,
            subject: `Safety Alert: ${eq.equipment_type} Expiry Notice`,
            text: `Equipment ${eq.equipment_type} (${eq.model}) at ${eq.location} expires on ${new Date(eq.expiry_date).toLocaleDateString()}. Please arrange inspection.`,
            html: `<h3>Fire Safety Equipment Expiry Notice</h3><p>Dear <strong>${eq.organization_name}</strong>,</p><p>Equipment: <strong>${eq.equipment_type} (${eq.model})</strong></p><p>Location: ${eq.location}</p><p>Expiry Date: <strong>${new Date(eq.expiry_date).toLocaleDateString()}</strong></p><p>Current Status: <span style="color: #b91c1c; font-weight: bold;">${eq.status}</span></p><p>Please raise a maintenance request before the expiration deadline.</p>`
        });

        return res.json({ message: `Expiry alert email sent successfully to ${eq.org_email}.` });
    } catch (error) {
        console.error('notifyEquipmentExpiry error:', error);
        return res.status(500).json({ message: 'Server error sending expiry notification.' });
    }
};

module.exports = {
    getEquipment,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getExpiringEquipment,
    notifyEquipmentExpiry
};
