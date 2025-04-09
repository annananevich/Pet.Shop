import { Given, When, Then } from "@cucumber/cucumber";
import { updatePet, getPet } from "../../api/petsApi";
import { expect } from "chai";
import { setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

setDefaultTimeout(30000);

Given("I have an existing pet for update", async function (this: CustomWorld) {
  if (!this.pet) {
    throw new Error("Pet was not created in the Before hook");
  }
  console.log("Using existing pet with ID:", this.pet.id);
});

When(
  "I update the pet's {string} to {string}",
  async function (this: CustomWorld, field, newValue) {
    if (!this.pet) {
      throw new Error("No pet found to update");
    }

    console.log(`Updating pet (ID: ${this.pet.id}): ${field} -> ${newValue}`);

    // Create a copy of the pet to modify
    const updatedPet = JSON.parse(JSON.stringify(this.pet));

    // Update the specified field
    if (field === "category") {
      updatedPet.category.name = newValue;
    } else {
      updatedPet[field] = newValue;
    }

    // Send update request
    const response = await updatePet(updatedPet);
    expect(response.status).to.equal(
      200,
      `Failed to update pet. Status: ${response.status}`
    );

    // Update local pet reference
    this.pet = response.body;
    console.log("Update successful, new pet data:", this.pet);
  }
);

Then(
  "the pet's {string} should be {string}",
  async function (this: CustomWorld, field, expectedValue) {
    if (!this.pet) {
      throw new Error("No pet found to validate");
    }

    console.log("Verifying pet with ID:", this.pet.id);

    // Add retry logic in case of eventual consistency
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const response = await getPet(this.pet.id);
        expect(response.status).to.equal(
          200,
          `Failed to retrieve pet. Status: ${response.status}`
        );

        const updatedPet = response.body;
        console.log("Retrieved pet data:", updatedPet);

        if (field === "category") {
          expect(updatedPet.category.name).to.equal(
            expectedValue,
            `Expected ${field} to be ${expectedValue}, but got ${updatedPet.category.name}`
          );
        } else {
          expect(updatedPet[field]).to.equal(
            expectedValue,
            `Expected ${field} to be ${expectedValue}, but got ${updatedPet[field]}`
          );
        }
        return; // Success - exit the function
      } catch (err) {
        lastError = err;
        retries--;
        if (retries > 0) {
          console.log(`Retry attempt ${4 - retries} failed, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    throw lastError || new Error("All retry attempts failed");
  }
);
