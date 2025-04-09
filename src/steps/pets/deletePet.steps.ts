import { Given, When, Then } from "@cucumber/cucumber";
import { deletePet, getPet } from "../../api/petsApi";
import { CustomWorld } from "../../support/world";
import { expect } from "chai";

Given(
  "I have an existing pet for deletion",
  async function (this: CustomWorld) {
    if (!this.pet) {
      throw new Error("Pet was not created in the Before hook");
    }
    console.log(`Using pet with ID: ${this.pet.id}`);
  }
);

When("I send a request to delete the pet", async function (this: CustomWorld) {
  if (!this.pet) {
    throw new Error("Error: pet not found for deletion");
  }

  let checkBeforeResponse = await getPet(this.pet.id);
  console.log(
    `Checking that the pet exists before deletion (GET ${this.pet.id})`
  );
  console.log(
    `Response to GET request before deletion: status ${checkBeforeResponse.status}, body:`,
    checkBeforeResponse.body
  );

  // If the first GET returns 404, try again after 2 seconds
  if (checkBeforeResponse.status === 404) {
    console.warn(`Pet with ID ${this.pet.id} not found. Retrying GET...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    checkBeforeResponse = await getPet(this.pet.id);
    console.log(
      `Response to retry GET request: status ${checkBeforeResponse.status}, body:`,
      checkBeforeResponse.body
    );
  }

  if (checkBeforeResponse.status === 404) {
    console.warn(`Pet with ID ${this.pet.id} is already deleted.`);
    return;
  }

  let response = await deletePet(this.pet.id, "special-key");
  console.log(
    `Response to DELETE request: status ${response.status}, body:`,
    response.body
  );

  // If DELETE returns 404, try again after 2 seconds
  if (response.status === 404) {
    console.warn(`Pet with ID ${this.pet.id} not found. Retrying deletion...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    response = await deletePet(this.pet.id, "special-key");
    console.log(
      `Response to retry DELETE request: status ${response.status}, body:`,
      response.body
    );
  }

  this.response = response;
});

Then(
  "the response should indicate successful deletion",
  function (this: CustomWorld) {
    console.log(
      `Checking that the response status = 200. Received status: ${this.response?.status}`
    );
    expect(this.response?.status).to.equal(200);
  }
);

Then(
  "the pet should no longer exist in the system",
  async function (this: CustomWorld) {
    console.log(
      `Sending GET request to check the existence of pet with ID: ${this.pet.id}`
    );

    let response = await getPet(this.pet.id);
    console.log(
      `Response to GET request: status ${response.status}, body:`,
      response.body
    );

    // If the pet is not deleted, try again after 2 seconds
    if (response.status === 200) {
      console.warn(`Pet with ID ${this.pet.id} still exists. Retrying GET...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      response = await getPet(this.pet.id);
      console.log(
        `Response to retry GET request after deletion: status ${response.status}, body:`,
        response.body
      );
    }

    console.log(
      `Checking that the pet no longer exists (expecting status 404)`
    );
    expect(response.status).to.equal(404);
  }
);
