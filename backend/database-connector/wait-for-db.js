import pg from "pg";

const { Client } = pg;
const MAX_RETRIES = 30;
let retries = 0;

console.log(`⏳ Aguardando o PostgreSQL inicializar completamente...`);

const checkConnection = async () => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();
    await client.query("SELECT 1;");
    console.log("✅ Banco de dados está 100% pronto e aceitando queries!");
    await client.end();
    process.exit(0);
  } catch (error) {
    retries++;
    if (retries >= MAX_RETRIES) {
      console.error(
        "❌ Tempo limite excedido. O banco de dados falhou em iniciar.",
      );
      console.error(error.message);
      process.exit(1);
    }
    client.end().catch(() => {});
    setTimeout(checkConnection, 1000);
  }
};

checkConnection();
