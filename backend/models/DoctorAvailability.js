const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Doctor = require('./Doctor');  

const DoctorAvailability = sequelize.define('DoctorAvailability', {
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATEONLY,  
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,  
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,  
        allowNull: false,
    },
}, {
    timestamps: true, 
});

module.exports = DoctorAvailability;
