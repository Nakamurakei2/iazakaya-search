import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import RecentForm from "./recent-form";
import { pool } from "@/lib/pool";
import { ShopsType } from "@/types/restaurant";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

type HistoryRowType = {
  history_id: number;
  restaurant_id: string;
  memi: string;
  created_at: Date;
};

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
    console.log("decoced", decoded);

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
  try {
    const result = await pool.query(
      `
      SELECT
        history_id,
        restaurant_id,
        memo,
        created_at
      FROM histories
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [userId],
    );

    const historyRestaurants: HistoryRowType[] = result.rows;

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

    histories = restaurants.filter(
      (restaurant): restaurant is ShopsType => restaurant !== null,
    );

    console.log("histories", histories);
  } catch (e: unknown) {
    console.error("e", e);
  }

  return <RecentForm shops={histories} authorized={true} />;
}
