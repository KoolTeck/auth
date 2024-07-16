const express = require("express");
const router = express.Router();
const { regFieldError } = require("../helpers/registrationError");
const authController = require("../controllers/authController");

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (!firstName) {
    regFieldError(res, "firstName", "firstName must not be empty");
  }

  if (!lastName) {
    regFieldError(res, "lastName", "lastName must not be empty");
  }
  if (!email) {
    regFieldError(res, "email", "email must not be empty");
  }
  if (!password) {
    regFieldError(res, "password", "password must not be empty");
  }
  if (!phone) {
    regFieldError(res, "phone", "phone must not be empty");
  }
  return authController.signUp(
    res,
    firstName,
    lastName,
    email,
    password,
    phone
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: "email or password required",
    });
  }
  authController.signIn(req, res, email, password);
});

module.exports = router;
