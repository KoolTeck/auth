require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_NAME
    : process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
  }
);

module.exports = db = {};

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

db.testDbConnection = testDbConnection;
db.sequelize = sequelize;

const User = require("../models/user_model");
const Organization = require("../models/organization_model");
User.belongsToMany(Organization, { through: "UserOrganization" });
Organization.belongsToMany(User, { through: "UserOrganization" });

db.User = User;
db.Organization = Organization;

sequelize
  .sync()
  .then(() => {
    console.log("db synced and created successfully!");
  })
  .catch((error) => {
    console.error("Unable to sync db : ", error);
  });
