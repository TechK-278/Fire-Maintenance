const db = require('../config/db');

const getOrganizations = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT o.*, u.email, 
                (SELECT COUNT(*) FROM equipment WHERE organization_id = o.organization_id) as total_equipment,
                (SELECT COUNT(*) FROM complaints WHERE organization_id = o.organization_id) as total_complaints
             FROM organizations o
             JOIN users u ON o.user_id = u.user_id
             ORDER BY o.organization_id DESC`
        );
        return res.json(rows);
    } catch (error) {
        console.error('getOrganizations error:', error);
        return res.status(500).json({ message: 'Server error retrieving organizations.' });
    }
};

const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT o.*, u.email
             FROM organizations o
             JOIN users u ON o.user_id = u.user_id
             WHERE o.organization_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('getOrganizationById error:', error);
        return res.status(500).json({ message: 'Server error retrieving organization.' });
    }
};

module.exports = {
    getOrganizations,
    getOrganizationById
};
