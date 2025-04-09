import { When, Then } from "@cucumber/cucumber";
import { getInventory } from "../../api/storeApi";
import { expect } from "chai";

let response: any;

When("a GET request is sent to {string}", async (endpoint: string) => {
  console.log(`[REQUEST] GET ${endpoint}`);
  response = await getInventory();
  console.log(`[STATUS] ${response.status}`);
});

Then("the response status should be {int}", (statusCode: number) => {
  console.log(`[CHECK] Status == ${statusCode}`);
  expect(response.status).to.equal(statusCode);
});

Then("the response body should contain the inventory list", () => {
  console.log(`[CHECK] Inventory list exists`);
  console.log("Inventory contents:", JSON.stringify(response.body, null, 2));

  expect(response.body).to.be.an("object");
  expect(Object.keys(response.body).length).to.be.greaterThan(0);
});
