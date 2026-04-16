import {
  createUserDB,
  getUsersDB,
  getUserById,
} from "#src/models/userModel.js";
import bcrypt from "bcrypt";

export const createUserService = async (username, email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUserDB(username, email, passwordHash);

  delete user.password;
  delete user.password_hash;

  return user;
};

export const getUsersService = async () => {
  const users = await getUsersDB();
  return users;
};

export const getUserByIdService = async (id) => {
  const user = await getUserById(id);
  return user;
};
