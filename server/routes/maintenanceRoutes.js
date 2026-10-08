const express = require('express');
const router = express.Router();
const {
    getMaintenanceRecords,
    createMaintenanceRecord
} = require('../controllers/maintenanceController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getMaintenanceRecords);
router.post('/', authorizeRoles('Admin', 'Technician'), createMaintenanceRecord);

module.exports = router;
