import { getStatus } from "#src/api/v1/status/index.js";

export const statusRoutes = (app) => {
  app.get("/api/v1/status", getStatus);
};
