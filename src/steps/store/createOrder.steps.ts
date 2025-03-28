import { When, Then, Given } from "@cucumber/cucumber";
import { expect } from "chai";
import { placeOrder } from "../../api/storeApi";
import { getOrder } from "../../api/storeApi";
import { faker } from "@faker-js/faker";
import { setTimeout } from "timers/promises";

// Create a new order using pet data from hooks
Given(
  "a new order with quantity {int}, and status {string}",
  async function (quantity: number, status: string) {
    console.log("Checking pet data in Given step before waiting:", this.pet);

    // Wait for 1 second (increase if necessary)
    await setTimeout(1000);

    console.log("Checking pet data in Given step after waiting:", this.pet);

    // Use petId that was created in the Before hook
    if (!this.pet || !this.pet.id) {
      throw new Error(
        "Pet ID not found, make sure the pet is created in the Before hook."
      );
    }

    // Store order data in CustomWorld
    this.orderData = {
      id: faker.number.int({ min: 1000, max: 9999 }), // Random order ID
      petId: this.pet.id, // Use dynamically created petId
      quantity: quantity,
      shipDate: new Date().toISOString(),
      status: status,
      complete: true,
    };

    console.log("New order data:", this.orderData);
  }
);

// Send a request to create an order
When(
  "a POST request is sent to {string} with the order details",
  async function (endpoint: string) {
    if (endpoint === "store/order") {
      this.response = await placeOrder(this.orderData);
      console.log("Order response:", this.response.body);
    } else {
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    }
  }
);

// Check response status
Then(
  "the response status for order creation should be {int}",
  function (statusCode: number) {
    console.log(
      `Expected status: ${statusCode}, Actual status: ${this.response.status}`
    );
    expect(this.response.status).to.equal(statusCode);
  }
);

// Verify the response body contains required fields
Then(
  "the response body should contain the order ID, petId, quantity, and status",
  function () {
    expect(this.response.body).to.have.property("id");
    expect(this.response.body).to.have.property("petId");
    expect(this.response.body).to.have.property("quantity");
    expect(this.response.body).to.have.property("status");
  }
);

// Check order status
Then("the response body status should be {string}", function (status: string) {
  expect(this.response.body.status).to.equal(status);
});

// Verify that the order is marked as complete
Then("the response body should have complete set to true", function () {
  expect(this.response.body.complete).to.equal(true);
});

// Ensure the created order can be retrieved
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // Delay between retries in milliseconds

Then("the created order should be retrievable", async function () {
  const orderId = this.response.body.id;
  let getResponse;

  console.log("Waiting 3 seconds before attempting to retrieve the order...");

  // Retry logic
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to retrieve order with ID: ${orderId}`);
      getResponse = await getOrder(orderId);

      if (getResponse.status === 200) {
        console.log("GET Order response:", getResponse.body);
        expect(getResponse.body).to.deep.equal(this.response.body);
        return; // Exit after a successful attempt
      } else {
        console.log(
          `Attempt ${attempt} failed with status: ${getResponse.status}`
        );
      }
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed with error: ${error.message}`);
    }

    if (attempt < MAX_RETRIES) {
      console.log(`Retrying after ${RETRY_DELAY / 1000} seconds...`);
      await setTimeout(RETRY_DELAY); // Wait before retrying
    }
  }

  // If no successful attempt, throw an error
  throw new Error(
    `Failed to retrieve order with ID: ${orderId} after ${MAX_RETRIES} attempts.`
  );
});
