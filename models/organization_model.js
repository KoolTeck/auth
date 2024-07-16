const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db.js");
const sq = db.sequelize;

const Organization = sq.define("organizations", {
  orgId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true,
  },
  description: {
    type: DataTypes.STRING,
  },
});

module.exports = Organization;
