require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;
async function startServer() {
  try {

  const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          usuario VARCHAR(100) UNIQUE NOT NULL,
          senha VARCHAR(255) NOT NULL,
          chave VARCHAR(255) NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          produto VARCHAR(255) NOT NULL,
          quantidade INTEGER NOT NULL,
          validade DATE NOT NULL
        );
      `);
    } else {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario TEXT UNIQUE NOT NULL,
          senha TEXT NOT NULL,
          chave TEXT NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          produto TEXT NOT NULL,
          quantidade INTEGER NOT NULL,
          validade TEXT NOT NULL
        );
      `);
    }

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

startServer();