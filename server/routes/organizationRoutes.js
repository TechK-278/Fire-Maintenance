const express = require('express');
const router = express.Router();
const {
    getOrganizations,
    getOrganizationById
} = require('../controllers/organizationController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', authorizeRoles('Admin'), getOrganizations);
router.get('/:id', getOrganizationById);

module.exports = router;
