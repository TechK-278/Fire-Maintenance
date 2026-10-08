const db = require('../config/db');

const getTechnicians = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, u.email,
                (SELECT COUNT(*) FROM tasks WHERE technician_id = t.technician_id) as total_tasks,
                (SELECT COUNT(*) FROM tasks WHERE technician_id = t.technician_id AND status = 'Completed') as completed_tasks
             FROM technicians t
             JOIN users u ON t.user_id = u.user_id
             ORDER BY t.technician_id DESC`
        );
        return res.json(rows);
    } catch (error) {
        console.error('getTechnicians error:', error);
        return res.status(500).json({ message: 'Server error retrieving technicians.' });
    }
};

const getTechnicianById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT t.*, u.email
             FROM technicians t
             JOIN users u ON t.user_id = u.user_id
             WHERE t.technician_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Technician not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('getTechnicianById error:', error);
        return res.status(500).json({ message: 'Server error retrieving technician.' });
    }
};

module.exports = {
    getTechnicians,
    getTechnicianById
};
