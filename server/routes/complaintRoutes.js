const express = require('express');
const router = express.Router();
const {
    getComplaints,
    getComplaintById,
    createComplaint
} = require('../controllers/complaintController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', authorizeRoles('Admin', 'Organization'), createComplaint);

module.exports = router;
