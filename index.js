require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const { testDbConnection } = require("./config/db");

const db = require("./config/db");
const sequelize = db.sequelize;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// middlewares
app.use("/auth", require("./routes/authRoute"));
app.use("/api", require("./routes/apiRoute"));
app.listen(PORT, async () => {
  await testDbConnection();
  console.log(`app listening on port ${PORT}`);
});

module.exports = app;
