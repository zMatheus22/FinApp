import { buildApp } from "../../src/app.js";
import { pool } from "../../src/database/index.js";

describe("Integration tests for the backend application", () => {
  let app;
  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await pool.end();
  });

  it("Deve acessar o endpoint de status e retornar as informações do banco de dados", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/status",
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("status", "OK");
    expect(responseBody).toHaveProperty("database");
    expect(responseBody.database).toHaveProperty("databaseNow");
    expect(responseBody.database).toHaveProperty("databaseVersion");
    expect(responseBody.database).toHaveProperty("databaseMaxConnections");
    expect(responseBody.database).toHaveProperty("databaseOpenedConnections");
  });
});
