import { getUsers, createUser } from "#src/api/v1/users/index.js";

export const usersRoutes = (app) => {
  app.get("/api/v1/users", getUsers);
  app.post("/api/v1/users", createUser);
};
