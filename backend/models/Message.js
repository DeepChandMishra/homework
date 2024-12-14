const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Message = sequelize.define('Message', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['doctor', 'patient']],
    },
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});


module.exports = Message;
