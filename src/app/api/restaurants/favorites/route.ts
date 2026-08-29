import { pool } from "@/lib/pool";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * お気に入り取得API
 */
export async function GET(req: NextResponse) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "認証情報が不正です" },
      { status: 401 },
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.sub;

  if (userId) {
    try {
      const query = `SELECT restaurant_id, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`;
      const result = await pool.query(query, [userId]);
      const rows = result.rows;

      return NextResponse.json(
        {
          mesasge: "お気に入り登録したレストランの情報の取得に成功しました！",
          favoriteRestaurants: rows,
        },
        {
          status: 200,
        },
      );
    } catch (e: unknown) {
      console.error("e", e);

      return NextResponse.json(
        {
          message: "お気に入り一覧の取得に失敗しました。",
        },
        {
          status: 500,
        },
      );
    }
  } else {
    // 未ログイン
    return NextResponse.json(
      { message: "ログインしてください。" },
      { status: 403 },
    );
  }
}
