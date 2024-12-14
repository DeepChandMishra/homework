const User = require('./User');
const Doctor = require('./Doctor');
const Consultation = require('./Consultation');
const DoctorAvailability = require('./DoctorAvailability');
const Message = require('./Message');

// Associations for Consultation
Consultation.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' }); // A Consultation belongs to a Patient (User with 'patient' role)
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' }); // A Consultation belongs to a Doctor

// Associations between User and Doctor
User.hasOne(Doctor, { foreignKey: 'userId' }); // A Doctor is a type of User
Doctor.belongsTo(User, { foreignKey: 'userId' }); // A Doctor must belong to a User

// Associations for Doctor and Availability
Doctor.hasMany(DoctorAvailability, { foreignKey: 'doctorId' }); // A Doctor can have multiple availability slots
DoctorAvailability.belongsTo(Doctor, { foreignKey: 'doctorId' }); // Availability is linked to a Doctor

// Associations for Consultation and DoctorAvailability
Consultation.belongsTo(DoctorAvailability, { foreignKey: 'doctorAvailabilityId' }); // A Consultation can be associated with a specific availability
DoctorAvailability.hasMany(Consultation, { foreignKey: 'doctorAvailabilityId' }); // A Doctor's availability can have multiple consultations

// Associations for Message
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' }); // A Message has a sender who is a User
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' }); // A Message has a receiver who is a User

// Message belongs to a Conversation

module.exports = {
    User,
    Doctor,
    Consultation,
    DoctorAvailability,
    Message,
};
