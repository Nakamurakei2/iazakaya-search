import { Pool } from "pg";

/**
 * 接続先のDBの情報を設定
 * →docker-compose.ymlの設定に沿って定義
 */
export const pool = new Pool({
  user: "root",
  host: "db",
  password: "password",
  database: "my_database",
  port: 5432,
});
