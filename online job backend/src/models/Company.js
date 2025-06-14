const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: { type: DataTypes.STRING, allowNull: false },
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
  tableName: 'company',
  timestamps: false,
  hooks: {
    beforeCreate: async (company) => {
      if (company.password) {
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(company.password, salt);
      }
    },
    beforeUpdate: async (company) => {
      if (company.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(company.password, salt);
      }
    }
  }
});

Company.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = Company;