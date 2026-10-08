const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken, authorizeRoles('Admin'));

router.get('/stats', getDashboardStats);

module.exports = router;
