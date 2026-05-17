const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  module.exports = pool;
} else {
  const dbPath = path.join(__dirname, "..", "data", "dev.db");
  const db = new sqlite3.Database(dbPath);

  const pool = {
    query: (text, params = []) => {
      const converted = text.replace(/\$([0-9]+)/g, "?");
      return new Promise((resolve, reject) => {
        const isSelect = /^\s*select/i.test(text.trim());
        if (isSelect) {
          db.all(converted, params, (err, rows) => {
            if (err) reject(err);
            else resolve({ rows: rows || [] });
          });
        } else {
          db.run(converted, params, function(err) {
            if (err) reject(err);
            else resolve({ rows: [], rowCount: this.changes });
          });
        }
      });
    },
    end: () => new Promise((resolve) => db.close(resolve))
  };

  module.exports = pool;
}