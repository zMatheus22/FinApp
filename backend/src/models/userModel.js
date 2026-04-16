import { pool } from "#src/database/index.js";

export const createUserDB = async (username, email, password) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at;",
      [username, email, password],
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const getUsersDB = async () => {
  const result = await pool.query(
    "SELECT id, username, email, created_at FROM users;",
  );
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = $1;",
    [id],
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE email = $1;",
    [email],
  );
  return result.rows[0];
};

export const getUserPasswordById = async (id) => {
  const user = await pool.query(
    "SELECT id, password FROM users WHERE id = $1;",
    [id],
  );

  return user.rows[0];
};

export const deleteUserDB = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1;", [id]);
};
