import request from "supertest";
import { baseUrl } from "./config";

export const placeOrder = (orderData: object) =>
  request(baseUrl)
    .post("/store/order")
    .send(orderData)
    .set("Content-Type", "application/json");

export const getOrder = (orderId: number) =>
  request(baseUrl)
    .get(`/store/order/${orderId}`)
    .set("Accept", "application/json");

export const deleteOrder = (orderId: number) =>
  request(baseUrl)
    .delete(`/store/order/${orderId}`)
    .set("Accept", "application/json");

export const getInventory = () =>
  request(baseUrl).get("/store/inventory").set("Accept", "application/json");
