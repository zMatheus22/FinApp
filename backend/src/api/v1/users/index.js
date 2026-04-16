import {
  createUserService,
  getUsersService,
  getUserByIdService,
  deleteUserService,
} from "#src/services/userService.js";

export const createUser = async (request, reply) => {
  const { username, email, password } = request.body;
  const user = await createUserService(username, email, password);
  return reply.status(201).send({
    message: "Usuário criado com sucesso",
    user: user,
  });
};

export const getUsers = async (request, reply) => {
  try {
    const usersResult = await getUsersService();

    const users = usersResult.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    }));

    const usersLength = usersResult.length;

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

export const getUserById = async (request, reply) => {
  try {
    const { id } = request.params;

    const user = await getUserByIdService(id);

    const body = {
      message: "Usuário encontrado com sucesso!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    };

    return reply.status(200).send(body);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Erro ao retornar usuário", error: error.message });
  }
};

export const deleteUser = async (request, reply) => {
  try {
    const { id } = request.params;
    const { password } = request.body;

    await deleteUserService(id, password);

    const body = {
      message: "Usuário deletado com sucesso!",
    };

    return reply.status(204).send(body);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao tentar deletar usuário",
      error: error.message,
    });
  }
};
