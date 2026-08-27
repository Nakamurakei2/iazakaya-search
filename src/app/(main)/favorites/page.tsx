import { RestaurantType } from "@/types/restaurant";
import FavoriteForm from "./favorite-form";
import { fetchFavorites } from "@/lib/api/favorites";

export default async function FavoritePage() {
  const favorites: RestaurantType[] = await fetchFavorites();

  return <FavoriteForm data={favorites} />;
}
