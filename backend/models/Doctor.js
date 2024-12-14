const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./User');


const Doctor = sequelize.define('Doctor', {
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactDetails: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id',
        },
    },
});

module.exports = Doctor;
