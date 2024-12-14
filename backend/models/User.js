const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('patient', 'doctor'),
        allowNull: false,
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
    otp: { 
        type: DataTypes.STRING,
        allowNull: true,
    },
    emailVerificationToken: {  
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = User;
