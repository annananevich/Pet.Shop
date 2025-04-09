import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { getUser } from "../../api/usersApi";

Given("I want to check if a user does not exist", function () {
  // Select username that is not in the system
  this.nonExistentUsername = "nonExistentUser123";
  console.log(`Non-existent username set: ${this.nonExistentUsername}`);
});

When("I send a request to fetch the non-existent user", async function () {
  console.log(
    `[getUser] Sending request to fetch user: ${this.nonExistentUsername}`
  );
  this.response = await getUser(this.nonExistentUsername);
  console.log(`[getUser] Response received:`, this.response.body);
});

Then("I should receive a 404 error with 'User not found' message", function () {
  expect(this.response.status).to.equal(404);
  expect(this.response.body.code).to.equal(1);
  expect(this.response.body.type).to.equal("error");
  expect(this.response.body.message).to.equal("User not found");
});
