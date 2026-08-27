import { pool } from "@/lib/pool";
import { NextResponse } from "next/server";

/**
 * お気に入り取得API
 */
export async function GET(req: NextResponse) {
  const token = req.cookies.get("auth_token");
  const userId = token?.value;

  if (userId) {
    try {
      const query = `SELECT restaurant_id FROM favorites WHERE user_id = $1`;
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
