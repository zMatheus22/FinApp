import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "#src/api/v1/users/index.js";

export const usersRoutes = (app) => {
  app.get("/api/v1/users", getUsers);
  app.get("/api/v1/users/:id", getUserById);
  app.post("/api/v1/users", createUser);
  app.delete("/api/v1/users/:id", deleteUser);
};
