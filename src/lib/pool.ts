import { Pool } from "pg";

/**
 * 接続先のDBの情報を設定
 * →docker-compose.ymlの設定に沿って定義
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
