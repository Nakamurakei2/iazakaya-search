import {
  AddFavoritesButtonProps,
  PaginationButtonProps,
  PaginationProps,
  Props,
  RestaurantType,
  SearchProps,
} from "@/types/restaurant";
import { calculateDistance } from "@/utils/caluclate-distance";
import { currentLocation } from "@/utils/location";
import { toast } from "sonner";

/**
 * 現在地から検索ボタン押下時処理
 */
export const handleLocationSearch = async (props: Props) => {
  const {
    pageSize,
    selectedGenres,
    setStartPage,
    setIsLocating,
    setLocationNotice,
    setCurrentLocationData,
    setTotalRestaurants,
    setShops,
    setStationName,
    setPage,
  } = props;
  // ボタンが押された際は毎回一番最初の近い順から取得したい

  setIsLocating(true);
  setLocationNotice("");

  const genreString = selectedGenres.join(",");

  try {
    // 現在地を取得
    const { latitude, longitude } = await currentLocation();
    setCurrentLocationData({
      latitude,
      longitude,
    });

    const params = new URLSearchParams({
      lat: String(latitude),
      lng: String(longitude),
      count: String(pageSize),
      start: String(1),
      genre: genreString,
    });

    // 店舗データを取得
    const res = await fetch(`/api/restaurants/search?${params.toString()}`, {
      method: "GET",
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(data.message, data.detail);
      toast.error(data.message);
      return;
    }
    const results_available = data.results_available;
    setTotalRestaurants(results_available); // 検索結果の全件数
    const shops: RestaurantType[] = data.shop;

    // APIから取得した店舗データを現在地から近い順に並び替える
    // もしかするとこの辺いらないかも→API側でsort機能があるので
    const sorted = shops
      .map((shop) => ({
        ...shop,
        distanceKm: calculateDistance(latitude, longitude, shop.lat, shop.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    // ソート済みの店舗データをstateに格納
    setShops(sorted);
    setStationName("");
    setPage(1);
    setStartPage(1);
    setLocationNotice("現在地から");
  } catch (e: unknown) {
    console.error("unexpectederror", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  } finally {
    setIsLocating(false);
  }
};

/**
 * 入力欄の「虫眼鏡」アイコンクリック or Enterキー押下時処理
 */
export const handleSearch = async (props: SearchProps) => {
  const {
    pageSize,
    startPage,
    selectedGenres,
    stationName,
    setIsLocating,
    setTotalRestaurants,
    setShops,
    setPage,
    setLocationNotice,
    setCurrentLocationData,
  } = props;

  if (!stationName) {
    toast.error("駅名を入力してください。");
    setShops([]);
  }
  let trimmed;
  const genreString = selectedGenres.join(",");

  // 末尾に「駅」が入ってる場合は省く
  const regex = /駅/g;
  if (regex.test(stationName)) {
    trimmed = stationName.replace(regex, "");
  } else {
    trimmed = stationName;
  }

  try {
    const params = new URLSearchParams({
      count: String(pageSize),
      start: String(startPage),
      station: trimmed,
      genre: genreString,
    });
    // stationNameに検索されたgeolocationを取得する
    const res = await fetch(`/api/restaurants/search?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      console.error(data.message, data.detail);
      toast.error(data.message);
      return;
    }
    const results_available = data.results_available;
    setTotalRestaurants(results_available); // 検索結果の全件数

    setCurrentLocationData({
      latitude: data.target_latitude,
      longitude: data.target_longitude,
    });

    const shops: RestaurantType[] = data.shop;
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

    // ソート済みの店舗データをstateに格納
    setShops(sorted);
    setPage(1);
    setLocationNotice(`${trimmed}駅から`);
  } catch (e: unknown) {
  } finally {
    setIsLocating(false);
  }
};

/**
 * ページネーション「>」ボタンクリック時処理
 */
export const handlePaginateNext = async (props: PaginationProps) => {
  const {
    pageSize,
    startPage,
    currentLocationData,
    setShops,
    setPage,
    setStartPage,
    scrollRef,
  } = props;
  if (!currentLocationData) {
    // 現在地取得できてないのでエラーを返したい
    return;
  }

  const nextStartPage = startPage + pageSize;
  const params = new URLSearchParams({
    lat: String(currentLocationData.latitude),
    lng: String(currentLocationData.longitude),
    count: String(pageSize),
    start: String(nextStartPage),
  });

  try {
    const res = await fetch(`/api/restaurants/search?${params.toString()}`, {
      method: "GET",
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(data.message, data.detail);
      toast.error(data.message);
      return;
    }
    const shops: RestaurantType[] = data.shop;
    const sorted = shops
      .map((shop) => ({
        ...shop,
        distanceKm: calculateDistance(
          currentLocationData.latitude,
          currentLocationData.longitude,
          shop.lat,
          shop.lng,
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    setShops(sorted);
    setPage((p) => p + 1);

    setStartPage(Number(data.results_start));
    scrollRef.current?.scrollIntoView({
      behavior: "instant",
    });
  } catch (e: unknown) {
    console.error("unexpected error", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

/**
 * ページネーション「<」ボタンクリック時処理
 */
export const handlePaginatePrevious = async (props: PaginationProps) => {
  const {
    pageSize,
    startPage,
    currentLocationData,
    setShops,
    setPage,
    setStartPage,
    scrollRef,
  } = props;
  // 1ページ目なら遷移させない
  if (!currentLocationData) {
    // 現在地を取得できていないのでエラーを返したい
    return;
  }
  const previousPage = Math.max(startPage - pageSize, 1);

  const params = new URLSearchParams({
    lat: String(currentLocationData.latitude),
    lng: String(currentLocationData.longitude),
    count: String(pageSize),
    start: String(previousPage),
  });

  try {
    const res = await fetch(`/api/restaurants/search?${params.toString()}`, {
      method: "GET",
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(data.message, data.detail);
      toast.error(data.message);
      return;
    }
    const shops: RestaurantType[] = data.shop;
    const sorted = shops
      .map((shop) => ({
        ...shop,
        distanceKm: calculateDistance(
          currentLocationData.latitude,
          currentLocationData.longitude,
          shop.lat,
          shop.lng,
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    setShops(sorted);
    setPage((p) => p - 1);
    setStartPage(Number(data.results_start));

    scrollRef.current?.scrollIntoView({
      behavior: "instant",
    });
  } catch (e: unknown) {
    console.error("unexpected error", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

/**
 * ページネーションのボタン押下時処理
 */
export const handlePaginateButtonClick = async (
  props: PaginationButtonProps,
) => {
  const {
    pageNumber,
    setStartPage,
    pageSize,
    currentLocationData,
    setShops,
    setPage,
  } = props;

  if (!currentLocationData) {
    // エラーハンドリング（再度検索し直すように促す）
    return;
  }
  const newStartPage = pageSize * (pageNumber - 1) + 1;
  const params = new URLSearchParams({
    lat: String(currentLocationData.latitude),
    lng: String(currentLocationData.longitude),
    start: String(newStartPage),
    count: String(pageSize),
  });

  try {
    const res = await fetch(`/api/restaurants/search?${params}`, {
      method: "GET",
    });

    const data = await res.json();
    if (!res.ok) {
    }

    const shops: RestaurantType[] = data.shop;
    const sorted = shops
      .map((shop) => ({
        ...shop,
        distanceKm: calculateDistance(
          currentLocationData.latitude,
          currentLocationData.longitude,
          shop.lat,
          shop.lng,
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    setShops(sorted);
    setPage(pageNumber);
    setStartPage(newStartPage);
  } catch (e: unknown) {}
};

/**
 * お気に入り登録ボタン押下時処理
 * @returns レストランのid
 */
export const handleAddFavoritesButtonClick = async (
  props: AddFavoritesButtonProps,
): Promise<string | undefined> => {
  const { restaurantId } = props;

  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantId }),
      // signal
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);

    return data.restaurant_id;
  } catch (e: unknown) {
    console.error("e", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

/**
 * お気に入り解除ボタン押下時処理
 */
export const handleDeleteFavoritesButton = async (
  props: AddFavoritesButtonProps,
) => {
  const { restaurantId } = props;

  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantId }),
      // signal
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);

    // return data.restaurant_id;
  } catch (e: unknown) {
    console.error("e", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};
