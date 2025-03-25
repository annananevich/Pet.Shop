import request from "supertest";
import { baseUrl } from "./config";

export const API_KEY = "special-key";

export const addPet = (petData: object) =>
  request(baseUrl)
    .post("/pet")
    .send(petData)
    .set("Content-Type", "application/json");

export const getPet = (petId: number) =>
  request(baseUrl).get(`/pet/${petId}`).set("Accept", "application/json");

export const deletePet = (petId: number, apiKey: string) =>
  request(baseUrl)
    .delete(`/pet/${petId}`)
    .set("Accept", "application/json")
    .set("api_key", apiKey)
    .set("Accept", "application/json");

export const updatePet = (petData: object) =>
  request(baseUrl)
    .put("/pet")
    .send(petData)
    .set("Content-Type", "application/json");
