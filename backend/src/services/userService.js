import {
  createUserDB,
  getUsersDB,
  getUserById,
  findUserByEmail,
  deleteUserDB,
  getUserPasswordById,
} from "#src/models/userModel.js";
import bcrypt from "bcrypt";
import { ErrorFormat } from "#src/services/erro.js";

export const createUserService = async (username, email, password) => {
  const existingUsers = await findUserByEmail(email);
  const emailExists = existingUsers && existingUsers.email === email;
  if (emailExists) {
    throw new ErrorFormat(409, "Este e-mail já está em uso.");
  }

  if (!username || !email || !password) {
    throw new ErrorFormat(400, "Todos os campos são obrigatórios.");
  }

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
  if (!id) {
    throw new ErrorFormat(400, "ID do usuário é obrigatório.");
  }

  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) {
    throw new ErrorFormat(400, "ID do usuário deve ser um UUID válido.");
  }

  const user = await getUserById(id);

  if (!user) {
    throw new ErrorFormat(404, "Usuário não encontrado.");
  }

  delete user.password;

  return user;
};

export const deleteUserService = async (id, pass) => {
  if (!pass) {
    throw new ErrorFormat(400, "Deve ser informada a senha do usuário.");
  }
  if (!id) {
    throw new ErrorFormat(400, "ID do usuário é obrigatório.");
  }
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) {
    throw new ErrorFormat(400, "ID do usuário deve ser um UUID válido.");
  }

  const user = await getUserPasswordById(id);
  if (!user) {
    throw new ErrorFormat(404, "Dados do usuário não encontrados.");
  }

  const isPasswordValid = await bcrypt.compare(pass, user.password);
  delete user.password;

  if (!isPasswordValid) {
    throw new ErrorFormat(401, "Senha incorreta.");
  }

  await deleteUserDB(id);
};
