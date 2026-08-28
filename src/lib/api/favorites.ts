import { FavoriteItem } from "@/types/restaurant";
import { cookies } from "next/headers";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

/**
 * お気に入りレストランデータ一覧取得API
 * @return お気に入り登録しているレストランのデータ
 */
export const fetchFavorites = async () => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    const userId = cookieStore.get("auth_token")?.value;

    if (!userId) return [];

    const res = await fetch("http://localhost:3000/api/restaurants/favorites", {
      method: "GET",
      headers: {
        Cookie: allCookies,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    const favorites = data.favoriteRestaurants;

    const restaurants = await Promise.all(
      favorites.map(async ({ restaurant_id, created_at }) => {
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
    return restaurants.filter(Boolean);
  } catch (e: unknown) {
    console.error("e", e);

    return [];
  }
};
