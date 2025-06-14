const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'company', key: 'id' }
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.TEXT, allowNull: false },
  salary: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: false },
  job_type: { type: DataTypes.STRING, allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'posts',
  timestamps: false
});

Post.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = Post;
