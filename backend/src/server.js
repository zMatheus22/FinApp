import { buildApp } from "#src/app/index.js";

const PORT = process.env.PORTBACKEND;
const app = buildApp();

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
