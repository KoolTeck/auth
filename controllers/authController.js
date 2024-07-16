const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const { signUpError, signInError } = require("../helpers/registrationError");

const User = db.User;
const Organization = db.Organization;
const signUp = async (res, firstName, lastName, email, password, phone) => {
  const saltRound = 10;
  try {
    // checking if user already exists
    const checkUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (checkUser) {
      signUpError(res);
    }

    const newUserdata = {
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, saltRound),
      phone,
    };

    const newUser = await User.create(newUserdata);
    // add user to defualt organization
    const defaultOrg = await Organization.create({
      name: `${firstName}'s Organisation`,
      description: "this is your default organization",
    });

    await newUser.addOrganization(defaultOrg);
    if (newUser) {
      // sign token
      const token = jwt.sign(
        { userId: newUser.userId },
        process.env.secretKey,
        {
          expiresIn: "1hr",
        }
      );
      const user = {
        userId: newUser.dataValues.userId,
        firstName: newUser.dataValues.firstName,
        lastName: newUser.dataValues.lastName,
        email: newUser.dataValues.email,
        phone: newUser.dataValues.phone,
      };

      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken: token,
          user: user,
        },
      });
    } else {
    }
  } catch (error) {
    console.log(error);
    signUpError(res);
  }
};

const signIn = async (req, res, email, password) => {
  // search user by mail
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = jwt.sign({ userId: user.userId }, process.env.secretKey, {
        expiresIn: "1hr",
      });
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: `${token}`,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      });
    } else {
      signInError(res);
    }
  } else {
    signInError(res);
  }
};
module.exports = { signUp, signIn };
