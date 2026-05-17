const path = require("path");
const fs = require("fs");
const initSqlJs = require("sql.js");

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  module.exports = pool;
} else {
  let db = null;
  const dbPath = path.join(__dirname, "..", "data", "dev.db");
  
  const pool = {
    init: async () => {
      const SQL = await initSqlJs();
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
      } else {
        db = new SQL.Database();
      }
    },

    query: async (text, params = []) => {
      if (!db) await pool.init();

      // Convert $1, $2, etc. to ? for sql.js
      let converted = text;
      params.forEach((_, i) => {
        converted = converted.replace(`$${i + 1}`, "?");
      });

      const isSelect = /^\s*select/i.test(text.trim());
      try {
        if (isSelect) {
          const result = db.exec(converted, params);
          const rows = result.length > 0 ? result[0].values.map((row) => {
            const columns = result[0].columns;
            const obj = {};
            columns.forEach((col, idx) => {
              obj[col] = row[idx];
            });
            return obj;
          }) : [];
          return { rows };
        } else {
          db.run(converted, params);
          fs.writeFileSync(dbPath, Buffer.from(db.export()));
          return { rows: [], rowCount: db.getRowsModified() };
        }
      } catch (err) {
        console.error("SQL Error:", err, "Query:", converted, "Params:", params);
        throw err;
      }
    },

    end: () => {
      if (db) db.close();
      return Promise.resolve();
    }
  };

  module.exports = pool;
}