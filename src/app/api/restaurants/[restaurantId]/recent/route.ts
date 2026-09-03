import { pool } from "@/lib/pool";
import { AddFavoritesButtonProps } from "@/types/restaurant";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type ContextType = {
  params: Promise<AddFavoritesButtonProps>;
};

/**
 * 履歴テーブルに格納
 */
export async function POST(req: NextRequest, context: ContextType) {
  const { restaurantId } = await context.params;
  console.log("restaurantId", restaurantId);
  const body = await req.json();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "認証情報が不正です" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      return NextResponse.json(
        { message: "認証情報が不正です" },
        { status: 401 },
      );
    }
    const userId = decoded.sub;

    const query = `
    INSERT INTO histories 
    (user_id, restaurant_id, memo, star)
    VALUES ($1, $2, $3, $4)
    `;

    const result = await pool.query(query, [userId, restaurantId, "", ""]);
    const rowCount = result.rowCount;

    if (rowCount !== 1) {
      console.error("historyテーブルへのデータの挿入に失敗しました");
      return NextResponse.json({ status: 500 });
    }
  } catch (e: unknown) {
    console.error("e", e);
  }

  return NextResponse.json({ message: "test" });
}
