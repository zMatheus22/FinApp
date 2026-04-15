import Fastify from "fastify";
import { pool } from "./database/index.js";

export const buildApp = () => {
  const app = Fastify();

  app.get("/", async (request, reply) => {
    return { message: "Server Backend, ON!" };
  });

  app.get("/api/v1/status", async (request, reply) => {
    let status = "OK";
    try {
      const databaseNow = await pool.query("SELECT now();");
      const databaseNowValue = databaseNow.rows[0].now;
      const databaseVersion = await pool.query("SELECT version();");
      const databaseVersionValue = databaseVersion.rows[0].version;
      const databaseMaxConnections = await pool.query("SHOW max_connections;");
      const databaseMaxConnectionsValue =
        databaseMaxConnections.rows[0].max_connections;

      const databaseName = process.env.POSTGRES_DB;
      const databaseOpenedConnectionsResult = await pool.query({
        text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
        values: [databaseName],
      });
      const databaseOpenedConnectionsValue =
        databaseOpenedConnectionsResult.rows[0].count;

      return reply.status(200).send({
        status: status,
        database: {
          databaseNow: databaseNowValue,
          databaseVersion: databaseVersionValue,
          databaseMaxConnections: databaseMaxConnectionsValue,
          databaseOpenedConnections: databaseOpenedConnectionsValue,
        },
      });
    } catch (error) {
      status = "Error";
    }
    return reply
      .status(500)
      .send({ status: "Error", message: "Erro de conexão com o banco" });
  });

  app.post("/api/v1/users", async (request, reply) => {
    const { username, email, password } = request.body;

    try {
      await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [username, email, password],
      );
      return reply.status(201).send({ message: "Usuário criado com sucesso" });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return reply
        .status(500)
        .send({ message: "Erro ao criar usuário", error: error.message });
    }
  });

  app.get("/api/v1/users", async (request, reply) => {
    try {
      const result = await pool.query("SELECT * FROM users;");
      const username = result.rows[0].username;
      const email = result.rows[0].email;
      return reply.status(200).send({ username: username, email: email });
    } catch (error) {
      return reply
        .status(500)
        .send({ message: "Erro ao retornar usuário", error: error.message });
    }
  });

  return app;
};
