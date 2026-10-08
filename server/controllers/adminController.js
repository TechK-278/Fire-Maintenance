const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const [[{ total_organizations }]] = await db.query('SELECT COUNT(*) as total_organizations FROM organizations');
        const [[{ total_technicians }]] = await db.query('SELECT COUNT(*) as total_technicians FROM technicians');
        const [[{ pending_complaints }]] = await db.query("SELECT COUNT(*) as pending_complaints FROM complaints WHERE status = 'Pending'");
        const [[{ in_progress_tasks }]] = await db.query("SELECT COUNT(*) as in_progress_tasks FROM tasks WHERE status = 'In Progress'");
        const [[{ completed_tasks }]] = await db.query("SELECT COUNT(*) as completed_tasks FROM tasks WHERE status = 'Completed'");
        const [[{ expired_equipment }]] = await db.query("SELECT COUNT(*) as expired_equipment FROM equipment WHERE expiry_date < CURDATE() OR status = 'Expired'");
        const [[{ active_tasks }]] = await db.query("SELECT COUNT(*) as active_tasks FROM tasks WHERE status IN ('Pending', 'In Progress')");
        const [[{ total_equipment }]] = await db.query('SELECT COUNT(*) as total_equipment FROM equipment');

        return res.json({
            total_organizations,
            total_technicians,
            pending_complaints,
            in_progress_tasks,
            completed_tasks,
            expired_equipment,
            active_tasks,
            total_equipment
        });
    } catch (error) {
        console.error('getDashboardStats error:', error);
        return res.status(500).json({ message: 'Server error retrieving dashboard statistics.' });
    }
};

module.exports = {
    getDashboardStats
};
