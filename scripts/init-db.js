// scripts/init-db.js

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const sql = fs.readFileSync(path.join(__dirname, "../db/init.sql"), "utf8");

    await client.query(sql);

    console.log("Database initialized.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
