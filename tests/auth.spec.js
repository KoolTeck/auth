let chai;
let expect;

before(async () => {
  chai = await import("chai");
  expect = chai.expect;
});

const request = require("supertest");
const app = require("../index");
const db = require("../config/db");
const User = db.User;
const Organisation = db.Organization;

describe("User and organisations auth Endpoints", async function () {
  beforeEach(async () => {
    await User.sync({ force: true }); // Drop and re-create tables
    await Organisation.sync({ force: true }); // Drop and re-create tables
  });

  it("It Should Register User Successfully with Default Organisation", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "testuser@example.com",
      password: "random123",
      phone: "1234567890",
    });
    const getOrg = await Organisation.findOne({
      where: {
        name: "John's Organisation",
      },
    });

    expect(res.status).to.equal(201);
    expect(res.body.data.user)
      .to.have.property("firstName")
      .that.equals("John");
    expect(res.body.data.user).to.have.property("lastName").that.equals("Doe");
    expect(res.body.data.user)
      .to.have.property("email")
      .that.equals("testuser@example.com");
    expect(res.body.data.user)
      .to.have.property("phone")
      .that.equals("1234567890");
    expect(getOrg.name).to.equal("John's Organisation");
  });

  it("should get a user by ID with auth token", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "testuser1@example.com",
      password: "random123",
      phone: "1234567890",
    });

    const resp = await request(app)
      .get(`/api/users/${res.body.data.user.userId}`)
      .set("Authorization", `Bearer ${res.body.data.accessToken}`);
    expect(resp.status).to.equal(200);
    expect(resp.body.data).to.have.property("firstName").that.equals("John");
  });

  //   it('should authenticate a user', async () => {
  //     await User.create({
  //       username: 'testuser',
  //       password: 'password123',
  //       email: 'testuser@example.com'
  //     });

  //     const res = await request(app)
  //       .post('/api/auth/login')
  //       .send({
  //         username: 'testuser',
  //         password: 'password123'
  //       });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property('token');
  //   });

  // Add more tests for other API endpoints and scenarios
});
