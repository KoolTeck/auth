const express = require("express");
const router = express.Router();

const db = require("../config/db");
const {
  checkToken,
  createOrg,
  addUserToOrganization,
} = require("../controllers/apiController");

const User = db.User;
const Organization = db.Organization;
router.get("/users/:id", checkToken, async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({
        error: "id param must not be empty",
      });
    }
    if (req.payload) {
      const user = await User.findByPk(userId);
      res.status(200).json({
        status: "success",
        message: "user details retrieved successfully",
        data: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/organisations", checkToken, async (req, res, next) => {
  try {
    const userId = req.payload.userId;
    const userOrg = await User.findByPk(userId, {
      include: {
        model: Organization,
        through: { attributes: [] },
        attributes: ["orgId", "name", "description"],
      },
    });

    return res.status(200).json({
      status: "success",
      message: "user organizations retrieved successfully",
      data: {
        organisations: userOrg.organizations,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).send("unable to retrieve user's organizations");
  }
});

router.get("/organisations/:orgId", checkToken, async (req, res, next) => {
  try {
    const orgId = req.params.orgId;
    if (!orgId) {
      res.status(400).json({
        error: "orgId param must not be empty",
      });
    }
    const organization = await Organization.findOne({
      where: {
        orgId: orgId,
      },
      attributes: ["orgId", "name", "description"],
    });
    if (organization) {
      res.status(200).json({
        status: "success",
        message: "organization retrieved successfully",
        data: organization,
      });
    } else {
      res.status(400).json({
        error: "organization details not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("unable to retrieve user's organization");
  }
});

router.post("/organisations", checkToken, (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.payload.userId;
  if (!name) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
  createOrg(res, userId, name, description);
});

router.post("/organisations/:orgId/users", (req, res, next) => {
  const orgId = req.params.orgId;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "userId field is required",
    });
  }

  addUserToOrganization(res, orgId, userId);
});
module.exports = router;
