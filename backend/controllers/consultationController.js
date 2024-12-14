const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const DoctorAvailability = require('../models/DoctorAvailability');

// available doctors
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }],
            attributes: ['id', 'specialization', 'contactDetails'], 
        });

        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.User.username,
            specialization: doctor.specialization,
        }));

        res.json(formattedDoctors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to find doctors' });
    }
};
// Request a consultation
exports.requestConsultation = async (req, res) => {
    try {
        const { patientId, doctorId, doctorAvailabilityId, reason, description, startTime, endTime } = req.body;

        if (!req.files || req.files.length === 0) {
            console.log("Images are missing");
            return res.status(400).json({ error: 'At least one image is required' });
        }

        if (!reason || !description) {
            console.log("Reason or description is missing");
            return res.status(400).json({ error: 'Reason and description are required' });
        }

        if (!startTime || !endTime) {
            console.log("Start time or end time is missing");
            return res.status(400).json({ error: 'Start time and end time are required' });
        }

        const availability = await DoctorAvailability.findByPk(doctorAvailabilityId, {
            where: { doctorId },
        });

        console.log("Doctor Availability:", availability);

        if (!availability) {
            console.log("Selected time slot not available");
            return res.status(400).json({ error: 'Selected time slot is not available.' });
        }

        const availabilityStart = availability.startTime;
        const availabilityEnd = availability.endTime;

        if (startTime < availabilityStart || endTime > availabilityEnd) {
            console.log("Selected time slot is outside of available hours");
            return res.status(400).json({ error: 'Selected time slot is outside of available hours' });
        }

        const imageUrls = req.files.map(file => file.path);

        const consultation = await Consultation.create({
            patientId,
            doctorId,
            doctorAvailabilityId,
            reason,
            description,
            imageUrl: imageUrls,
            startTime,  
            endTime,  
        });

        console.log("Consultation Created:", consultation);

        return res.status(201).json({ message: 'Consultation requested', consultation });
    } catch (error) {
        console.error("Error requesting consultation:", error);
        res.status(500).json({ error: 'Failed to request consultation' });
    }
};



exports.getConsultationStatus = async (req, res) => {
    const { patientId } = req.params;

    try {
        const doctors = await Doctor.findAll();
        
        if (!doctors.length) {
            return res.status(200).json({ message: 'No doctors available' });
        }

        const consultations = await Consultation.findAll({
            where: { patientId },
            attributes: ['id', 'doctorId', 'status', 'doctorAvailabilityId', 'startTime', 'endTime'],
            include: [
                {
                    model: Doctor,
                    attributes: ['specialization'],
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                        },
                    ],
                },
                {
                    model: DoctorAvailability,
                    attributes: ['date', 'startTime', 'endTime'],
                },
            ],
        });

        if (consultations.length > 0) {
            const formattedConsultations = consultations.map(consultation => ({
                id: consultation.id,
                doctorId: consultation.doctorId,
                status: consultation.status,
                doctorName: consultation.Doctor.User.username,
                specialty: consultation.Doctor.specialization,
                doctorAvailability: {
                    date: consultation.DoctorAvailability.date,
                    startTime: consultation.DoctorAvailability.startTime,
                    endTime: consultation.DoctorAvailability.endTime,
                },
                selectedTimeSlot: {
                    startTime: consultation.startTime,
                    endTime: consultation.endTime,
                },
            }));
            return res.json(formattedConsultations); 
        }

        return res.status(200).json([]); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch consultation status' });
    }
};

exports.getAvailableSlotsForAllPatients = async (req, res) => {
    const { doctorId } = req.params;  

    try {
        const availability = await DoctorAvailability.findAll({
            where: { doctorId },
            attributes: ['id', 'startTime', 'endTime', 'date'],
        });

        if (!availability.length) {
            return res.status(404).json({ message: 'No availability found for this doctor' });
        }

        const consultations = await Consultation.findAll({
            where: { doctorId },
            attributes: ['id', 'patientId', 'status', 'doctorAvailabilityId', 'startTime', 'endTime'],
        });

        return res.json({ availability, consultations });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return res.status(500).json({ message: 'Failed to fetch available slots', error });
    }
};

exports.getAcceptedConsultations = async (req, res) => {
    const {userId:patientId}  = req.user; 

    // Log the user info and patientId to verify the middleware is working correctly
    console.log('Authenticated User:', req.user);
    console.log('Patient ID:', patientId);

    if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is missing or undefined' });
    }

    try {
        // Log the database query
        console.log('Fetching consultations for patientId:', patientId);

        const consultations = await Consultation.findAll({
            where: {
                patientId,
                status: 'Accepted',
            },
            include: [
                {
                    model: Doctor,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                        },
                    ],
                },
            ],
        });

        if (!consultations || consultations.length === 0) {
            console.log('No consultations found.');
            return res.status(404).json({ message: 'No doctors have accepted your consultation yet.' });
        }

        // Log consultations for debugging
        console.log('Consultations:', consultations);

        const doctors = consultations.map((consultation) => ({
            doctorId: consultation.Doctor.id,
            doctorName: consultation.Doctor.User.username,
        }));

        console.log('Doctors:', doctors); // Log the doctors extracted from the consultations

        res.status(200).json({ doctors });
    } catch (error) {
        console.error('Error fetching accepted consultations:', error);
        res.status(500).json({ error: 'Failed to fetch accepted consultations' });
    }
};


exports.getAcceptedPatientsForChat = async (req, res) => {
    try {
        // Access doctorId from the user object
        const doctorId = req.user.doctorId; // Accessing doctorId directly

        console.log('Authenticated User:', req.user);
        console.log('Doctor ID:', doctorId);

        if (!doctorId) {
            return res.status(400).json({ error: 'Doctor ID is missing or undefined' });
        }

        // Fetching consultations for the doctor, including associated Patient's User data
        const consultations = await Consultation.findAll({
            where: {
                doctorId,
                status: 'Accepted',
            },
            include: [
                {
                    model: User, // Include Patient's User details
                    as: 'Patient', // Use alias 'Patient' to correctly access the associated User
                    attributes: ['username'], // Fetch username of the patient
                },
            ],
        });

        if (!consultations.length) {
            return res.status(404).json({ message: 'No patients found with accepted consultations.' });
        }

        // Mapping consultations to retrieve patient info
        const patientsForChat = consultations.map(consultation => ({
            patientId: consultation.patientId,
            patientName: consultation.Patient.username, // Access Patient's username via the alias 'Patient'
        }));

        return res.json(patientsForChat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch patients for chat.' });
    }
};







