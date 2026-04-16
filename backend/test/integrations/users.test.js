import { pool } from "#src/database/index.js";
import { buildApp } from "#src/app/index.js";

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
    const responseBody = JSON.parse(response.body);
    expect(responseBody.user.username).toBe("Matheus");
    expect(responseBody.user.email).toBe("matheus@email.com");
    expect(Date.parse(responseBody.user.created_at)).not.toBeNaN();
    expect(responseBody.user.password).not.toBeDefined();
    expect(responseBody.message).toBe("Usuário criado com sucesso");
  });

  it("Deve ser capaz de retornar o usuário que acabou de ser criado", async () => {
    const user1 = {
      username: "Ana",
      email: "ana@email.com",
      password: "123456",
    };

    await app.inject({
      method: "POST",
      url: "/api/v1/users",
      payload: user1,
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/users",
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.quantity).toBe(1);
    expect(responseBody.user[0].username).toBe("Ana");
    expect(responseBody.user[0].email).toBe("ana@email.com");
  });

  it("Deve ser capaz de retornar 2 usuários", async () => {
    const user1 = {
      username: "Ana",
      email: "ana@email.com",
      password: "123456",
    };

    const user2 = {
      username: "Carlos",
      email: "carlos@email.com",
      password: "123456",
    };

    await app.inject({
      method: "POST",
      url: "/api/v1/users",
      payload: user1,
    });

    await app.inject({
      method: "POST",
      url: "/api/v1/users",
      payload: user2,
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/users",
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.quantity).toBe(2);
    expect(responseBody.user[0].id).toBeDefined();
    expect(responseBody.user[0].username).toBe("Ana");
    expect(responseBody.user[0].email).toBe("ana@email.com");
    expect(responseBody.user[0].created_at).toBeDefined();
    expect(responseBody.user[0].created_at).not.toBeNaN();
    expect(responseBody.user[0].password).not.toBeDefined();
    expect(responseBody.user[1].id).toBeDefined();
    expect(responseBody.user[1].username).toBe("Carlos");
    expect(responseBody.user[1].email).toBe("carlos@email.com");
    expect(responseBody.user[1].created_at).toBeDefined();
    expect(responseBody.user[1].created_at).not.toBeNaN();
    expect(responseBody.user[1].password).not.toBeDefined();
    expect(responseBody.message).toBe("Usuários retornados com sucesso");
  });

  it("Deve ser capaz de buscar o usuário pelo ID", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/users",
      payload: {
        username: "joao",
        email: "joao@email.com",
        password: "123456",
      },
    });

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.user.id).toBeDefined();
    const idUser = responseBody.user.id;

    const resultGetID = await app.inject({
      method: "GET",
      url: `/api/v1/users/${idUser}`,
    });

    const resultGetIDBody = JSON.parse(resultGetID.payload);
    expect(resultGetIDBody.user.id).toBeDefined();
    expect(resultGetIDBody.user.username).toBe("joao");
    expect(resultGetIDBody.user.email).toBe("joao@email.com");
    expect(resultGetIDBody.user.created_at).toBeDefined();
    expect(resultGetIDBody.user.created_at).not.toBeNaN();
    expect(resultGetIDBody.user.password).not.toBeDefined();
    expect(resultGetIDBody.message).toBe("Usuário encontrado com sucesso!");
  });
});
