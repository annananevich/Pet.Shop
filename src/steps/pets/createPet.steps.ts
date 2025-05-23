import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { addPet } from "../../api/petsApi";
import { faker } from "@faker-js/faker";
import { setDefaultTimeout } from "@cucumber/cucumber";
import { setTimeout } from "timers/promises";
import { retryGetPet } from "../../utils/retryGetPet";

setDefaultTimeout(60000);

const delay = (ms: number) => setTimeout(ms);

Given("I create the following pets:", async function (dataTable) {
  this.pets = dataTable
    .hashes()
    .map(
      (
        row: { name: string; status: string; category: string },
        index: number
      ) => ({
        id: faker.number.int({ min: 100000, max: 999999 }),
        category: { id: index + 1, name: row.category },
        name: row.name,
        photoUrls: [faker.image.url()],
        tags: [{ id: faker.number.int(100), name: faker.word.noun() }],
        status: row.status,
      })
    );

  console.log("Generated pets data:", this.pets);
});

When("I send requests to add pets", async function () {
  this.petIds = [];

  for (const pet of this.pets) {
    console.log("Sending request with pet data:", pet);
    const response = await addPet(pet);
    expect(response.status).to.equal(200);

    pet.id = response.body.id;
    this.petIds.push(pet.id);
  }

  console.log("Saved pet IDs:", this.petIds);
});

Then("The responses should contain the IDs of the new pets", function () {
  expect(this.petIds).to.have.lengthOf(this.pets.length);
  this.petIds.forEach((id: number) => expect(id).to.be.a("number"));
});

When("I send requests to retrieve pet information", async function () {
  this.retrievedPets = [];
  console.log("Starting to retrieve pet information...");

  for (const petId of this.petIds) {
    try {
      const pet = await retryGetPet(petId);
      this.retrievedPets.push(pet);
      console.log("Retrieved pet data:", pet);
    } catch (err) {
      console.error("Error retrieving pet:", err);
      throw err;
    }
  }
});

Then("The responses should contain the pets' details", function () {
  expect(this.retrievedPets).to.have.lengthOf(this.pets.length);

  this.retrievedPets.forEach(
    (
      retrievedPet: {
        id: number;
        name: string;
        status: string;
        category: { id: number; name: string };
        photoUrls: string[];
        tags: { id: number; name: string }[];
      },
      index: number
    ) => {
      const originalPet = this.pets[index];

      expect(retrievedPet.id).to.equal(originalPet.id);
      expect(retrievedPet.name).to.equal(originalPet.name);
      expect(retrievedPet.status).to.equal(originalPet.status);
      expect(retrievedPet.category.id).to.equal(originalPet.category.id);
      expect(retrievedPet.category.name).to.equal(originalPet.category.name);
      expect(retrievedPet.photoUrls).to.deep.equal(originalPet.photoUrls);
      expect(retrievedPet.tags).to.deep.equal(originalPet.tags);
    }
  );
});
