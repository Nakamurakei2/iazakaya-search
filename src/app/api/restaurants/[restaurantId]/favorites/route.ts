import { pool } from "@/lib/pool";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type ContextType = {
  params: Promise<{ restaurantId: string }>;
};

interface DatabaseError extends Error {
  code: string;
}

// 型ガード関数
function isDatabaseError(error: unknown): error is DatabaseError {
  return error !== null && typeof error === "object" && "code" in error;
}

/**
 * お気に入り登録API
 */
export async function POST(req: NextRequest, context: ContextType) {
  try {
    const { restaurantId } = await context.params;
    // ログイン中のユーザーIDを取得する
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");
    const userId = token?.value;

    if (userId) {
      // user_idとrestaurant_idを登録する
      const query = `INSERT INTO favorites (user_id, restaurant_id) VALUES ($1, $2) RETURNING restaurant_id`;
      const result = await pool.query(query, [Number(userId), restaurantId]);
      const restauratId = result.rows[0].restaurant_id;

      return NextResponse.json(
        { message: "お気に入り追加しました！", restaurant_id: restauratId },
        { status: 201 },
      );
    } else {
      // userIdがない場合
      console.error("ログインしていないユーザーです");
      return NextResponse.json(
        {
          message:
            "アクセス権限がありません。ログイン後に再度実行してください。",
        },
        { status: 401 },
      );
    }
  } catch (e: unknown) {
    console.error("e!", e);

    if (isDatabaseError(e)) {
      if (e.code === "23505") {
        // database一意性エラー
        return NextResponse.json(
          { message: "すでに登録済みのお店です。", detail: "一意性制約違反" },
          { status: 409 },
        );
      }
    }
  }

  return NextResponse.json({ message: "test" });
}

/**
 * お気に入り削除API
 */
export const DELETE = async (req: NextRequest, context: ContextType) => {
  const { restaurantId } = await context.params;
  console.log("restaurantId", restaurantId);

  // Cookieの確認
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  const userId = token?.value;

  if (userId) {
    try {
      const query = `
      DELETE FROM favorites 
      WHERE user_id = $1 AND restaurant_id = $2 
      RETURNING restaurant_id
      `;
      const result = await pool.query(query, [userId, restaurantId]);
      const deletedRestaurantId = result.rows[0].restaurant_id;

      return NextResponse.json(
        {
          message: "削除しました",
          detail: `${deletedRestaurantId}を削除しました`,
        },
        { status: 200 },
      );
    } catch (e: unknown) {
      console.error("e", e);
    }
  } else {
    // 未ログイン
  }
};
