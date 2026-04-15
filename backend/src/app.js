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

  return app;
};
