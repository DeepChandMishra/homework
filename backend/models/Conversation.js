const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Conversation = sequelize.define('Conversation', {
  participants: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  messages: {
    type: DataTypes.JSON, 
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = Conversation;
