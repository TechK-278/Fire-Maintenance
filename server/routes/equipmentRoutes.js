const express = require('express');
const router = express.Router();
const {
    getEquipment,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getExpiringEquipment,
    notifyEquipmentExpiry
} = require('../controllers/equipmentController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getEquipment);
router.get('/expiring', getExpiringEquipment);
router.get('/:id', getEquipmentById);
router.post('/', authorizeRoles('Admin', 'Organization'), addEquipment);
router.put('/:id', authorizeRoles('Admin', 'Organization'), updateEquipment);
router.delete('/:id', authorizeRoles('Admin', 'Organization'), deleteEquipment);
router.post('/:id/notify-expiry', authorizeRoles('Admin', 'Organization'), notifyEquipmentExpiry);

module.exports = router;
