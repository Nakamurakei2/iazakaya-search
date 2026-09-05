import { FavoriteItem, ShopsType } from "@/types/restaurant";
import FavoriteForm from "./favorite-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

const LIMIT = 10;

// TODO：内部APIへのアクセスはいらない。DBに直接アクセスで事足りる。
export default async function FavoritePage() {
  let favorites: ShopsType[] = [];
  let totalRestaurants: number = 0;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    if (!decoded.sub) {
      throw new Error("Token payload missing sub");
    }

    const userId = decoded.sub;

    // 直接DBから取得(offset, limitが必要)
    const result = await pool.query(
      `
        SELECT restaurant_id, created_at
        FROM favorites
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
        OFFSET 0
      `,
      [userId],
    );

    const countResult = await pool.query(
      `
      SELECT count(*) AS TOTAL
      FROM favorites
      WHERE user_id = $1
      `,
      [userId],
    );

    const favoriteRestaurants = result.rows;
    const countRestaurants = countResult.rows[0].total;
    totalRestaurants = countRestaurants;

    const restaurants = await Promise.all(
      favoriteRestaurants.map(async ({ restaurant_id, created_at }) => {
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
    favorites = restaurants;
  } catch (e: unknown) {
    console.error("お気に入り取得エラー:", e);
  }

  return <FavoriteForm shops={favorites} restaurantsTotal={totalRestaurants} />;
}
