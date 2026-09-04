import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";
import { HistoryRowType } from "@/types/restaurant";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const offset = searchParams.get("offset");
  const limit = searchParams.get("limit");

  try {
    // Cookieでログイン情報取得
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

    // hsitoriesテーブルからuserIdに紐づいたデータを取得
    const userId = decoded.sub;

    const query = `
      SELECT *
      FROM (
        SELECT DISTINCT ON (restaurant_id)
          restaurant_id,
          memo,
          star,
          created_at
        FROM histories
        WHERE user_id = $1
        ORDER BY restaurant_id, created_at DESC
      ) AS unique_histories
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3
    `;

    // 該当するレストランの合計を返す
    const countQuery = `
    SELECT count(DISTINCT restaurant_id) AS total
    FROM histories
    WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    const historyRestaurants: HistoryRowType[] = result.rows;

    const countResult = await pool.query(countQuery, [userId]);
    const totalRestaurants = countResult.rows[0].total;

    // 外部APIにてレストランデータを取得
    const restaurants = await Promise.all(
      historyRestaurants.map(async ({ restaurant_id, created_at }) => {
        const res = await fetch(
          `${apiBaseUrl}&id=${restaurant_id}&format=json`,
        );

        if (!res.ok) {
          return null;
        }

        const data = await res.json();
        return {
          ...data.results.shop[0],
          created_at,
        };
      }),
    );

    return NextResponse.json(
      {
        message: "データの取得に成功しました。",
        shops: restaurants,
        totalRestaurants: totalRestaurants,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.error("e", e);
  }
}
