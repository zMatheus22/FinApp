import { pool } from "#src/database/index.js";

export const createUser = async (request, reply) => {
  const { username, email, password } = request.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [username, email, password],
    );

    return reply.status(201).send({
      message: "Usuário criado com sucesso",
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        created_at: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return reply
      .status(500)
      .send({ message: "Erro ao criar usuário", error: error.message });
  }
};

export const getUsers = async (request, reply) => {
  try {
    const result = await pool.query("SELECT * FROM users;");

    const users = result.rows.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    }));
    const usersLength = result.rows.length;

    const body = {
      message: "Usuários retornados com sucesso",
      quantity: usersLength,
      user: users,
    };
    return reply.status(200).send(body);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Erro ao retornar usuários", error: error.message });
  }
};
