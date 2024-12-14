const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole'); 

const { 
    createDoctorAvailability, 
    getDoctorAvailability, 
    deleteDoctorAvailability 
} = require('../controllers/doctorAvailability');

router.post('/doctor/availability', authMiddleware, checkRole(['doctor']), createDoctorAvailability);

router.get('/doctors/:doctorId/availability',authMiddleware,checkRole(['patient','doctor']), getDoctorAvailability);

router.delete('/doctor/availability/:availabilityId', authMiddleware, checkRole(['doctor']), deleteDoctorAvailability);

module.exports = router;