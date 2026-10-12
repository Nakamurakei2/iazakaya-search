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

    // csv読み込み
    const csvPath = path.join(__dirname, "../db/stations.csv");
    const csv = fs.readFileSync(csvPath, "utf8");

    const lines = csv.trim().split("\n");
    console.log("lines", lines);

    // delete current stations data
    await client.query("TRUNCATE TABLE stations RESTART IDENTITY");

    for (const row of lines) {
      const [id, name, hiragana, lat, lon, address] = row.split(",");

      await client.query(
        `
          INSERT INTO stations (station_id, name,hiragana, lat, lon, address)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [id, name, hiragana, Number(lat), Number(lon), address],
      );
    }

    console.log("Database initialized.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
