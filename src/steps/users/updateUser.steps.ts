import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { createUser, updateUser } from "../../api/usersApi";
import { generateUserData } from "../../utils/generateUserData";
import { retryGetUser } from "../../utils/retryGetUser";

Given("I have created a new user", async function () {
  // Generate user data
  this.userData = generateUserData();
  console.log("Generated user data:", this.userData);

  // Create user
  console.log("[createUser] Sending request to create user...");
  const createResponse = await createUser(this.userData);
  console.log("[createUser] User creation response:", createResponse.body);
  expect(createResponse.status).to.equal(200);

  // Fetch user after creation using retryGetUser
  let user = await retryGetUser(this.userData.username);

  expect(user).to.not.be.undefined;
  expect(user.username).to.equal(this.userData.username);
  expect(user.firstName).to.equal(this.userData.firstName);
  expect(user.lastName).to.equal(this.userData.lastName);
  expect(user.email).to.equal(this.userData.email);
  expect(user.phone).to.equal(this.userData.phone);
});

When("I update the user's details", async function () {
  // Create a copy of the user data to prevent modifying the original
  const updatedData = JSON.parse(JSON.stringify(this.userData));

  // Generate unique but more readable data
  const uniqueId = Date.now().toString().slice(-6);
  updatedData.firstName = `UpdatedFirstName_${uniqueId}`;
  updatedData.lastName = `UpdatedLastName_${uniqueId}`;
  updatedData.email = `updated.${uniqueId}@example.com`;
  updatedData.phone = `987654${Math.floor(Math.random() * 10000)}`;

  console.log("[updateUser] Sending request to update user data:", updatedData);

  // Send the update request
  const updateResponse = await updateUser(this.userData.username, updatedData);
  console.log("[updateUser] User update response:", updateResponse.body);
  expect(updateResponse.status).to.equal(200);

  // Save the updated data to this for further verification
  this.updatedUserData = updatedData;

  // Add a small delay to give the system time to apply the update
  await new Promise((res) => setTimeout(res, 2000)); // Wait 2 seconds before checking
});

Then("I should see the updated user details", async function () {
  // Fetch updated data using retryGetUser
  const updatedUser = await retryGetUser(this.userData.username);

  expect(updatedUser).to.not.be.undefined;
  expect(updatedUser.firstName).to.equal(this.updatedUserData.firstName);
  expect(updatedUser.lastName).to.equal(this.updatedUserData.lastName);
  expect(updatedUser.email).to.equal(this.updatedUserData.email);
  expect(updatedUser.phone).to.equal(this.updatedUserData.phone);
});
