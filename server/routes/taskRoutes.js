const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTaskById,
    updateTaskStatus
} = require('../controllers/taskController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id/status', authorizeRoles('Admin', 'Technician'), updateTaskStatus);

module.exports = router;
