import { buildApp } from "#src/app/index.js";

const PORT = process.env.PORTBACKEND;
const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      port: Number(PORT) || 3000,
      host: "0.0.0.0",
    });

    const address = app.server.address();
    const host = typeof address === "string" ? address : address?.address;
    const port = typeof address === "string" ? PORT : address?.port;

    console.log(`Server is running on host ${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
