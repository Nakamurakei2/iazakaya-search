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
 * stationsテーブルから駅名と緯度/軽度を取得する
 */
export const searchRestaurantFetch = async (props: SearchProps) => {
  const { selectedGenres, stationName, startPage } = props;
  const genreString = selectedGenres.join(",");

  // stationNameを使用してDBからlat/lonを取得する
  const stationParam = new URLSearchParams({
    station: stationName,
  });

  try {
    const res = await fetch(`/api/station?${stationParam}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();
    const { lat, lon } = data.result;

    // hotpepperグルメAPI発火
    const restaurantParams = new URLSearchParams({
      count: String(LIMIT),
      start: String(startPage),
      lat,
      lng: lon,
      genre: genreString,
    });

    const restaurantRes = await fetch(
      `/api/restaurants/search?${restaurantParams.toString()}`,
    );

    if (!restaurantRes.ok) {
      const restaurantData = await restaurantRes.json();
      console.error(restaurantData.message, restaurantData.detail);
      toast.error(restaurantData.message);
      return;
    }
    const restaurantData = await restaurantRes.json();
    const resultsAvailable: number = restaurantData.results_available;

    const shops: RestaurantType[] = restaurantData.shops;
    // APIから取得した店舗データを現在地から近い順に並び替える
    const sorted = shops
      .map((shop) => ({
        ...shop,
        distanceKm: calculateDistance(lat, lon, shop.lat, shop.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      sortedRestaurants: sorted,
      resultsAvailable,
      station: stationName,
    };
  } catch (e: unknown) {
    console.error("e", e);
  }
};
