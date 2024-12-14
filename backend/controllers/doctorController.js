const Consultation = require('../models/Consultation');
const User = require('../models/User');
const Doctor = require('../models/Doctor'); 
const DoctorAvailability = require('../models/DoctorAvailability');

// consultation requests 
exports.getConsultationRequests = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const doctorId = req.user.doctorId;

    try {
        const consultations = await Consultation.findAll({
            where: { doctorId },
            include: [
                { 
                    model: User, 
                    as: 'Patient', 
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: DoctorAvailability, 
                    attributes: ['date', 'startTime', 'endTime'],  
                },
            ],
        });

        const response = consultations.length > 0 
            ? consultations.map(consultation => ({
                id: consultation.id,
                patientId: consultation.patientId,
                doctorId: consultation.doctorId,
                status: consultation.status,
                doctorAvailability: {
                    date: consultation.DoctorAvailability.date,
                    startTime: consultation.DoctorAvailability.startTime,
                    endTime: consultation.DoctorAvailability.endTime,
                },
                selectedTimeSlot: {
                    startTime: consultation.startTime,
                    endTime: consultation.endTime,
                },
                imageUrl: consultation.imageUrl.replace(/\\/g, '/'),  
                patientUsername: consultation.Patient.username,
                reason: consultation.reason,
                description: consultation.description,
            }))
            : [];

        res.json(response);
    } catch (error) {
        console.error("Error fetching consultation requests:", error);
        res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
    }
};

// Update consultation status
exports.updateConsultationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const consultation = await Consultation.findByPk(id);
        console.log('Received status:', status);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found.' });
        }

        if (status === 'Accepted') {
            consultation.status = 'Accepted';
        } else if (status === 'Completed') {
                consultation.status = 'Completed';
        } else if (status === 'Rejected') {
            consultation.status = 'Rejected';
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await consultation.save();
        res.json({ message: 'Consultation updated successfully', consultation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to updatestatus' });
    }
};

