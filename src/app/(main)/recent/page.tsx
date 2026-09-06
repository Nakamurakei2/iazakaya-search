import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import RecentForm from "./recent-form";
import { pool } from "@/lib/pool";
import { HistoryRowType, ShopsType } from "@/types/restaurant";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

export default async function RecentPage() {
  let decoded: jwt.JwtPayload;

  try {
    // 認証情報が正しい場合はformにリダイレクトさせる
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      redirect("/");
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    // すでにserver sideなので直接DBを叩く
  } catch (e: unknown) {
    console.error(
      "サインアップ画面でのJWT検証失敗（スルーして画面を表示）:",
      e,
    );

    redirect("/");
  }
  const userId = decoded.sub;

  if (!userId) {
    redirect("/");
  }
  let histories: ShopsType[] = [];
  let totalRestaurants: number = 0;
  try {
    const result = await pool.query(
      `
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
        LIMIT 10
        OFFSET 0
      `,
      [userId],
    );
    console.log("result", result, "userId", userId);

    const countResult = await pool.query(
      `
      SELECT count(DISTINCT restaurant_id) AS total
      FROM histories
      WHERE user_id = $1
      `,
      [userId],
    );
    const historyRestaurants: HistoryRowType[] = result.rows;
    console.log("historyRestaurants", historyRestaurants);

    const countRestaurants = countResult.rows[0].total;
    totalRestaurants = countRestaurants;

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
        console.log("data", data);
        return {
          ...data.results.shop[0],
          created_at,
        };
      }),
    );

    histories = restaurants;
    console.log("restaurants", restaurants);
  } catch (e: unknown) {
    console.error("e", e);
  }

  return <RecentForm shops={histories} restaurantsTotal={totalRestaurants} />;
}
