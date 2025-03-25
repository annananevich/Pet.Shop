import request from "supertest";
import { baseUrl } from "./config";

export const createUser = (userData: object) =>
  request(baseUrl)
    .post("/user")
    .send(userData)
    .set("Content-Type", "application/json");

export const getUser = (username: string) =>
  request(baseUrl).get(`/user/${username}`).set("Accept", "application/json");

export const deleteUser = (username: string) =>
  request(baseUrl)
    .delete(`/user/${username}`)
    .set("Accept", "application/json");

export const loginUser = (username: string, password: string) =>
  request(baseUrl)
    .get("/user/login")
    .query({ username, password })
    .set("Accept", "application/json");

export const logoutUser = () =>
  request(baseUrl).get("/user/logout").set("Accept", "application/json");
