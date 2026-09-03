import { FavoriteItem, ShopsType } from "@/types/restaurant";
import FavoriteForm from "./favorite-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

const LIMIT = 20;

// TODO：内部APIへのアクセスはいらない。DBに直接アクセスで事足りる。
export default async function FavoritePage() {
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
  } catch (e: unknown) {
    console.error("認証エラー:", e);
    redirect("/");
  }

  let favorites: ShopsType[] = [];
  let totalFavorites: string = "";

  try {
    const allCookies = cookieStore.toString();

    const params = new URLSearchParams({
      limit: String(LIMIT),
      offset: "0",
    });

    const res = await fetch(
      `${process.env.APP_URL}/api/restaurants/favorites?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Cookie: allCookies,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );

    if (res.ok) {
      const data = await res.json();
      const favoriteRestaurants: FavoriteItem[] = data.favoriteRestaurants;
      totalFavorites = data.totalFavorites;

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

      favorites = restaurants.filter(
        (restaurant): restaurant is ShopsType => restaurant !== null,
      );
    }
  } catch (e: unknown) {
    console.error("お気に入り取得エラー:", e);
  }

  return <FavoriteForm data={favorites} totalFavorites={totalFavorites} />;
}
