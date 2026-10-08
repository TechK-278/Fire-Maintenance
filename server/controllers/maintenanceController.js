const db = require('../config/db');
const { sendEmail } = require('../utils/email');

const getMaintenanceRecords = async (req, res) => {
    try {
        const { role, organizationId, technicianId } = req.user;
        let query = `
            SELECT 
                m.*,
                e.equipment_type, e.model as equipment_model, e.location as equipment_location,
                c.description as complaint_description, c.complaint_date,
                o.organization_id, o.organization_name, o.contact_person, o.phone as org_phone, o.address as org_address,
                tech.name as technician_name, tech.phone as technician_phone
            FROM maintenance_records m
            JOIN equipment e ON m.equipment_id = e.equipment_id
            JOIN complaints c ON m.complaint_id = c.complaint_id
            JOIN organizations o ON e.organization_id = o.organization_id
            JOIN technicians tech ON m.technician_id = tech.technician_id
        `;
        const params = [];

        if (role === 'Organization') {
            query += ' WHERE o.organization_id = ? ORDER BY m.record_id DESC';
            params.push(organizationId);
        } else if (role === 'Technician') {
            query += ' WHERE m.technician_id = ? ORDER BY m.record_id DESC';
            params.push(technicianId);
        } else {
            query += ' ORDER BY m.record_id DESC';
        }

        const [rows] = await db.query(query, params);
        return res.json(rows);
    } catch (error) {
        console.error('getMaintenanceRecords error:', error);
        return res.status(500).json({ message: 'Server error retrieving maintenance records.' });
    }
};

const createMaintenanceRecord = async (req, res) => {
    try {
        const { role, technicianId: authTechId } = req.user;
        let { equipment_id, complaint_id, technician_id, description } = req.body;

        if (role === 'Technician') {
            technician_id = authTechId;
        }

        if (!equipment_id || !complaint_id || !technician_id || !description) {
            return res.status(400).json({ message: 'All maintenance record fields are required.' });
        }

        const maintenanceDate = new Date().toISOString().slice(0, 10);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [recordResult] = await connection.query(
                `INSERT INTO maintenance_records (equipment_id, complaint_id, technician_id, maintenance_date, description, status)
                 VALUES (?, ?, ?, ?, ?, 'Completed')`,
                [equipment_id, complaint_id, technician_id, maintenanceDate, description]
            );

            await connection.query(
                `UPDATE tasks SET status = 'Completed' WHERE complaint_id = ? AND technician_id = ?`,
                [complaint_id, technician_id]
            );

            await connection.query(
                `UPDATE complaints SET status = 'Completed' WHERE complaint_id = ?`,
                [complaint_id]
            );

            const [infoRows] = await connection.query(
                `SELECT o.organization_name, u.email as org_email, e.equipment_type, e.model, tech.name as tech_name, tech.phone as tech_phone
                 FROM complaints c
                 JOIN organizations o ON c.organization_id = o.organization_id
                 JOIN users u ON o.user_id = u.user_id
                 JOIN equipment e ON c.equipment_id = e.equipment_id
                 JOIN technicians tech ON tech.technician_id = ?
                 WHERE c.complaint_id = ?`,
                [technician_id, complaint_id]
            );

            await connection.commit();

            if (infoRows.length > 0 && infoRows[0].org_email) {
                const info = infoRows[0];
                sendEmail({
                    to: info.org_email,
                    subject: `Maintenance Completed: ${info.equipment_type}`,
                    text: `Maintenance has been completed for ${info.equipment_type} by technician ${info.tech_name}. Details: ${description}`,
                    html: `<h3>Maintenance Completed Successfully</h3><p>Dear <strong>${info.organization_name}</strong>,</p><p>Equipment: <strong>${info.equipment_type} (${info.model})</strong></p><p>Technician: <strong>${info.tech_name}</strong> (${info.tech_phone})</p><p>Work Performed: ${description}</p><p>Date: ${maintenanceDate}</p>`
                });
            }

            return res.status(201).json({
                message: 'Maintenance record created and task marked completed.',
                record_id: recordResult.insertId
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('createMaintenanceRecord error:', error);
        return res.status(500).json({ message: 'Server error saving maintenance record.' });
    }
};

module.exports = {
    getMaintenanceRecords,
    createMaintenanceRecord
};
