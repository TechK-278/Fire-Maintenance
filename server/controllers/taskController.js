const db = require('../config/db');

const getTasks = async (req, res) => {
    try {
        const { role, technicianId } = req.user;
        let query = `
            SELECT 
                t.*,
                c.description as complaint_description, c.complaint_date, c.status as complaint_status,
                o.organization_id, o.organization_name, o.contact_person, o.phone as org_phone, o.address as org_address, o.latitude as org_lat, o.longitude as org_lng,
                e.equipment_id, e.equipment_type, e.model as equipment_model, e.location as equipment_location,
                tech.name as technician_name, tech.phone as technician_phone
            FROM tasks t
            JOIN complaints c ON t.complaint_id = c.complaint_id
            JOIN organizations o ON c.organization_id = o.organization_id
            JOIN equipment e ON c.equipment_id = e.equipment_id
            JOIN technicians tech ON t.technician_id = tech.technician_id
        `;
        const params = [];

        if (role === 'Technician') {
            query += ' WHERE t.technician_id = ? ORDER BY t.task_id DESC';
            params.push(technicianId);
        } else {
            query += ' ORDER BY t.task_id DESC';
        }

        const [rows] = await db.query(query, params);
        return res.json(rows);
    } catch (error) {
        console.error('getTasks error:', error);
        return res.status(500).json({ message: 'Server error retrieving tasks.' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT 
                t.*,
                c.description as complaint_description, c.complaint_date, c.status as complaint_status,
                o.organization_id, o.organization_name, o.contact_person, o.phone as org_phone, o.address as org_address, o.latitude as org_lat, o.longitude as org_lng,
                e.equipment_id, e.equipment_type, e.model as equipment_model, e.location as equipment_location,
                tech.name as technician_name, tech.phone as technician_phone
            FROM tasks t
            JOIN complaints c ON t.complaint_id = c.complaint_id
            JOIN organizations o ON c.organization_id = o.organization_id
            JOIN equipment e ON c.equipment_id = e.equipment_id
            JOIN technicians tech ON t.technician_id = tech.technician_id
            WHERE t.task_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('getTaskById error:', error);
        return res.status(500).json({ message: 'Server error retrieving task.' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const [tasks] = await db.query('SELECT * FROM tasks WHERE task_id = ?', [id]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        const task = tasks[0];

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('UPDATE tasks SET status = ? WHERE task_id = ?', [status, id]);
            await connection.query('UPDATE complaints SET status = ? WHERE complaint_id = ?', [status, task.complaint_id]);

            await connection.commit();
            return res.json({ message: 'Task and complaint status updated successfully.', status });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('updateTaskStatus error:', error);
        return res.status(500).json({ message: 'Server error updating task status.' });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    updateTaskStatus
};
