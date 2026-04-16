import { pool } from "#src/database/index.js";

export const createUserDB = async (username, email, password) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at;",
    [username, email, password],
  );
  return result.rows[0];
};

export const getUsersDB = async () => {
  const result = await pool.query("SELECT * FROM users;");
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
  return result.rows[0];
};
