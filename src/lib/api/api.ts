import { LIMIT } from "@/app/(main)/mainForm";
import { FavoriteItem, RestaurantType } from "@/types/restaurant";
import { calculateDistance } from "@/utils/caluclate-distance";
import { toast } from "sonner";

type LocationRestaurantFetch = {
  selectedGenres: string[];
  latitude: number;
  longitude: number;
  start: number;
};

/**
 * 現在地から検索のtanstack query
 */
export const restaurantFetch = async (props: LocationRestaurantFetch) => {
  const { selectedGenres, latitude, longitude, start } = props;

  const genreString = selectedGenres.join(",");
  console.log("latitude", latitude, longitude, start);
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    count: String(LIMIT), // 取得数
    start: String(start), // 開始位置
    genre: genreString,
  });
  const restaurantsResult = await fetch(
    `/api/restaurants/search?${params.toString()}`,
    {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!restaurantsResult.ok) {
    const restaurantData = await restaurantsResult.json();
    console.error(restaurantData.message, restaurantData.detail);
    toast.error(restaurantData.message);
    throw new Error(restaurantData.message);
  }
  const restaurantData = await restaurantsResult.json();
  console.log("restaurantData", restaurantData);
  const resultsAvailable = restaurantData.results_available;
  const shops: RestaurantType[] = restaurantData.shops;
  // APIから取得した店舗データを現在地から近い順に並び替える
  const sorted = shops
    .map((shop) => ({
      ...shop,
      distanceKm: calculateDistance(latitude, longitude, shop.lat, shop.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return {
    sortedRestaurants: sorted,
    resultsAvailable,
    latitude,
    longitude,
    results_start: restaurantData.results_start * LIMIT,
  };
};

/**
 * お気に入りレストラン情報
 */
export const favoriteRestaurantsFetch = async () => {
  const res = await fetch(`/api/restaurants/favorites`, {
    method: "GET",
    signal: AbortSignal.timeout(1000),
  });
  if (!res.ok) {
    const data = await res.json();
    console.error(data.message);
    throw new Error(data.message);
  }
  const favoriteIdsData = await res.json();
  const favoriteIds: FavoriteItem[] = favoriteIdsData.favoriteRestaurants;
  return {
    favoriteIds,
  };
};

type SearchProps = {
  selectedGenres: string[];
  stationName: string;
  startPage: number;
};

/**
 * 検索欄からの検索
 */
export const searchRestaurantFetch = async (props: SearchProps) => {
  const { selectedGenres, stationName, startPage } = props;
  const genreString = selectedGenres.join(",");
  let trimmed;

  // 末尾に「駅」が入ってる場合は省く
  const regex = /駅/g;
  if (regex.test(stationName)) {
    trimmed = stationName.replace(regex, "");
  } else {
    trimmed = stationName;
  }

  const params = new URLSearchParams({
    count: String(LIMIT),
    start: String(startPage),
    station: trimmed,
    genre: genreString,
  });
  // stationNameに検索されたgeolocationを取得する
  const res = await fetch(`/api/restaurants/search?${params.toString()}`);

  if (!res.ok) {
    const data = await res.json();
    console.error(data.message, data.detail);
    toast.error(data.message);
    return;
  }
  const data = await res.json();
  const resultsAvailable: number = data.results_available;

  const shops: RestaurantType[] = data.shops;
  // APIから取得した店舗データを現在地から近い順に並び替える
  const sorted = shops
    .map((shop) => ({
      ...shop,
      distanceKm: calculateDistance(
        data.target_latitude,
        data.target_longitude,
        shop.lat,
        shop.lng,
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  console.log("shops", shops);
  return {
    sortedRestaurants: sorted,
    resultsAvailable,
    station: trimmed,
  };
};
