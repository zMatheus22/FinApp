import Fastify from "fastify";
import { usersRoutes } from "#src/routes/users.js";
import { statusRoutes } from "#src/routes/status.js";

export const buildApp = () => {
  const app = Fastify();

  app.get("/", async (request, reply) => {
    return reply.status(200).send({ message: "Server Backend, ON!" });
  });

  app.register(usersRoutes);
  app.register(statusRoutes);

  return app;
};
