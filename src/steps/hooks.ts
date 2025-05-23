import { Before, After } from "@cucumber/cucumber";
import { addPet, deletePet } from "../api/petsApi";
import { deleteUser } from "../api/usersApi";
import { deleteOrder } from "../api/storeApi";
import { faker } from "@faker-js/faker";
import { CustomWorld } from "../support/world";

// Before each test with the @autoCreatePet tag, create a pet
Before({ tags: "@autoCreatePet" }, async function (this: CustomWorld) {
  this.token = "special-key";
  console.log("Received token for creating pet:", this.token);

  this.pet = {
    id: faker.number.int({ min: 100000, max: 999999 }),
    category: { id: 1, name: "Dog" },
    name: faker.person.firstName(),
    photoUrls: [faker.image.url()],
    tags: [{ id: faker.number.int(100), name: faker.word.noun() }],
    status: "available",
  };

  console.log("Creating pet in Before hook:", this.pet);

  const response = await addPet(this.pet);
  this.pet.id = response.body.id;
  this.petIds = [this.pet.id];

  console.log("Pet successfully created with ID:", this.pet.id);
});

// Get the token for deleting pets, but only if @cleanupPet tag is present
Before({ tags: "@cleanupPet" }, async function (this: CustomWorld) {
  this.deleteToken = "special-key";
  console.log("Received token for deleting pets:", this.deleteToken);
});

After({ tags: "@cleanupPet" }, async function (this: CustomWorld) {
  console.log("🚀 After hook @cleanupPet executed!");
  if (this.petIds && this.petIds.length > 0) {
    for (const petId of this.petIds) {
      console.log(`Deleting pet with ID: ${petId} (After hook)`);
      await deletePet(petId, "special-key");
    }
  }
});

After({ tags: "@cleanupUser" }, async function (this: CustomWorld) {
  console.log("🚀 After hook @cleanupUser executed!");

  if (this.userData?.username) {
    console.log(`Deleting user: ${this.userData.username} (After hook)`);
    await deleteUser(this.userData.username);
  }
});

After({ tags: "@cleanupOrder" }, async function (this: CustomWorld) {
  if (this.orderData?.id) {
    console.log(`Deleting order with ID: ${this.orderData.id}`);
    await deleteOrder(this.orderData.id);
    console.log(`Order with ID: ${this.orderData.id} successfully deleted`);
  } else {
    console.log("Order data is not available for deletion.");
  }
});
