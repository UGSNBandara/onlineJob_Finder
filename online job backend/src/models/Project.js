const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Project = sequelize.define('Project', {
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
  topic: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  skill: { type: DataTypes.JSON, allowNull: true },
  year: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'project',
  timestamps: false
});

Project.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Project;
