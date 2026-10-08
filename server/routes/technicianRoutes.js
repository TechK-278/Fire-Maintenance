const express = require('express');
const router = express.Router();
const {
    getTechnicians,
    getTechnicianById
} = require('../controllers/technicianController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', authorizeRoles('Admin'), getTechnicians);
router.get('/:id', getTechnicianById);

module.exports = router;
