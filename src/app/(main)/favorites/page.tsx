import { RestaurantType } from "@/types/restaurant";
import FavoriteForm from "./favorite-form";
import { fetchFavorites } from "@/lib/api/favorites";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function FavoritePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    console.error("未ログインのユーザー：Cookieなし");
    redirect("/");
  }

  try {
    // 2. JWTの検証（期限切れや改ざんはここでキャッチする）
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    if (!decoded.sub) {
      throw new Error("Token payload missing sub");
    }
  } catch (e: unknown) {
    console.error("認証エラー（期限切れまたは改ざん）：", e);

    redirect("/"); // Cookie削除？？
  }

  const favorites: RestaurantType[] = await fetchFavorites();

  return <FavoriteForm data={favorites} />;
}
