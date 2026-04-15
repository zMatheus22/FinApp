import { pool } from "../../src/database/index.js";
import { buildApp } from "../../src/app.js";

describe("CRUD de usuários", () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  afterEach(async () => {
    await pool.query("DELETE FROM users;");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("Deve ser capaz de criar um novo usuário", async () => {
    const newUser = {
      username: "Matheus",
      email: "matheus@email.com",
      password: "123456",
    };

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/users",
      payload: newUser,
    });

    expect(response.statusCode).toBe(201);
  });
});
