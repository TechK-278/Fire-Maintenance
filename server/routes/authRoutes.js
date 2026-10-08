const express = require('express');
const router = express.Router();
const {
    registerOrganization,
    registerTechnician,
    login,
    getMe,
    updateProfile,
    deleteAccount
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register/organization', registerOrganization);
router.post('/register/technician', registerTechnician);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.delete('/profile', verifyToken, deleteAccount);

module.exports = router;
