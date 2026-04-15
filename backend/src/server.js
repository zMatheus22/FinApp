import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const app = Fastify();
const PORT = process.env.PORT || 3333;

app.get("/", async (request, reply) => {
  return { message: "Server Backend, ON!" };
});

const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Servidor rodando na porta ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
