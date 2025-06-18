const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'user', key: 'id' }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'user', key: 'id' }
  },
  message_text: { type: DataTypes.TEXT, allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      const rawValue = this.getDataValue('created_at');
      return rawValue ? new Date(rawValue).toISOString() : null;
    }
  }
}, {
  tableName: 'messages',
  timestamps: false
});

// Define associations after all models are loaded
const setupAssociations = () => {
  Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
};

// Call setupAssociations after all models are loaded
setupAssociations();

module.exports = Message;
