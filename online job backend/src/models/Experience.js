const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Experience = sequelize.define('Experience', {
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
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  from_year: { type: DataTypes.INTEGER, allowNull: false },
  to_year: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'experience',
  timestamps: false
});

// Association (optional but recommended)
Experience.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Experience;
