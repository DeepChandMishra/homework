const express = require('express');
const {
    getConsultationRequests,
    updateConsultationStatus,
} = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.get('/requests', authMiddleware, checkRole(['doctor']), getConsultationRequests);
router.put('/requests/:id/status', authMiddleware, checkRole(['doctor']), updateConsultationStatus);
module.exports = router;
