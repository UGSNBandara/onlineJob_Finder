const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Post = require('./Post');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'user', key: 'id' }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'company', key: 'id' }
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'posts', key: 'id' }
  },
  message_text: { type: DataTypes.TEXT, allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
  timestamps: false
});

// Define associations after all models are loaded
const setupAssociations = () => {
  Message.belongsTo(User, { foreignKey: 'user_id' });
  Message.belongsTo(Company, { foreignKey: 'company_id' });
  Message.belongsTo(Post, { foreignKey: 'post_id' });
};

// Call setupAssociations after all models are loaded
setupAssociations();

module.exports = Message;
