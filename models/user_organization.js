const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db.js");
console.log(db.User);
const sq = db.sequelize;
const User = db.User;
const Organization = db.Organization;

const User_organization = sq.define("user_organizations", {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: Organization,
    },
  },
  orgId: {
    type: DataTypes.UUID,
    references: {
      model: User,
    },
  },
});

module.exports = User_organization;
