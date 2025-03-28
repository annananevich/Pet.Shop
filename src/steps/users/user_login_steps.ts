import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { createUser, loginUser, logoutUser } from "../../api/usersApi";
import { generateUserData } from "../../utils/generateUserData";

Given("I create a new user", async function () {
  const userData = generateUserData();
  console.log("Generated user data:", userData);

  this.userData = userData;

  // User Creation
  const response = await createUser(this.userData);
  console.log("User creation response:", response.body);
  expect(response.status).to.equal(200);
});

When("I log in with the new user's credentials", async function () {
  console.log(
    `Attempting to log in with username: ${this.userData.username} and password: ${this.userData.password}`
  );
  this.loginResponse = await loginUser(
    this.userData.username,
    this.userData.password
  );
  console.log("Login response:", this.loginResponse.body);
});

Then("I should be logged in and see a session message", function () {
  console.log("Checking login response message...");
  expect(this.loginResponse.body.message).to.include("logged in user session");
});

When("I log out", async function () {
  console.log("Attempting to log out...");
  this.response = await logoutUser();
  console.log("Logout response:", this.response.body);
});

Then("I should be logged out", function () {
  console.log("Checking logout status...");
  expect(this.response.status).to.equal(200);
});
