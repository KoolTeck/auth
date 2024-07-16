const jwt = require("jsonwebtoken");
const db = require("../config/db");

const User = db.User;
const Organization = db.Organization;
const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (header) {
    try {
      const token = header.split(" ")[1];
      const payload = jwt.verify(token, process.env.secretKey);
      req.payload = payload;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error("JWT Error:", error.message);
        res.status(401).send(error.message);
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).send(error.message);
        console.error("JWT Expired:", error.message);
      } else if (error instanceof jwt.NotBeforeError) {
        res.status(401).send(error.message);
        console.error("JWT Not Yet Valid:", error.message);
      } else {
        res.status(401).send(error.message);
        console.error("JWT Verification Error:", error.message);
      }
    }
  } else {
    res.status(403).json({
      error: "token bearer required",
    });
  }
};

const createOrg = async (res, userId, name, description) => {
  try {
    // get user creating the org from db
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    const newOrg = await Organization.create({
      name,
      description,
      attributes: ["orgId", "name", "description"],
    });
    newOrg.addUser(user);
    if (newOrg) {
      res.status(200).json({
        status: "success",
        message: "Organisation created successfully",
        data: {
          orgId: newOrg.orgId,
          name: newOrg.name,
          description: newOrg.description,
        },
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("unable to create new organization");
  }
};

const addUserToOrganization = async (res, orgId, userId) => {
  // const UserOrganization = db.sequelize.models.UserOrganization;

  // const checkRelation = await checkUserOrganizationRelationship(userId, orgId);
  // if (checkRelation) {
  //   return res.status(400).json({
  //     status: "failed",
  //     message: "User already exits in the organisation",
  //   });
  // }

  try {
    const user = await User.findOne({
      where: {
        userId,
      },
    });
    const organisation = await Organization.findOne({
      where: {
        orgId,
      },
    });
    if (user && organisation) {
      await organisation.addUser(user);
      res.status(200).json({
        status: "success",
        message: "User added to organisation successfully",
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message:
          "Unable to add user to organisation, either userId or orgId is wrong",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "failed",
      message: "Unable to add user to organisation",
    });
  }
};

// function to check if userId and orgId are related
async function checkUserOrganizationRelationship(userId, orgId) {
  try {
    // Find the User and include Organizations they are associated with
    const user = await User.findByPk(userId, {
      include: {
        model: Organization,
        through: "UserOrganization",
        where: { orgId: orgId },
      },
    });
    if (user && user.organizations.length > 0) {
      console.log(
        `User with id ${userId} is related to Organization with id ${orgId}`
      );
      return true;
    } else {
      console.log(
        `User with id ${userId} is not related to Organization with id ${orgId}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error checking relationship:", error);
    throw error;
  }
}

module.exports = { checkToken, createOrg, addUserToOrganization };
