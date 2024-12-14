const express = require('express');
const multer = require('multer');
const {
    getDoctors,
    requestConsultation,
    getConsultationStatus,getAvailableSlotsForAllPatients,
    getAcceptedConsultations,
    getAcceptedPatientsForChat
} = require('../controllers/consultationController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole'); 

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Multer configuration with size and file limits
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    }
}).array('images', 5);

router.get('/doctors', authMiddleware, getDoctors);
router.post('/request', authMiddleware, upload, requestConsultation);
router.get('/status/:patientId', authMiddleware, checkRole(['patient']), getConsultationStatus);
router.get('/getAvailableSlotsForAllPatients/:doctorId', authMiddleware, checkRole(['patient']), getAvailableSlotsForAllPatients);
router.get('/doctors-for-chat', authMiddleware, checkRole(['patient']),getAcceptedConsultations);
router.get('/patients-for-chat', authMiddleware,checkRole(['doctor']), getAcceptedPatientsForChat);


module.exports = router;
