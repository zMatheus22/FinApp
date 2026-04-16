import { pool } from "#src/database/index.js";

export const getStatus = async (request, reply) => {
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
    .send({ status: status, message: "Erro de conexão com o banco" });
};
