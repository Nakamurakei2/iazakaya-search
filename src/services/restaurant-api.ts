import {
  AddFavoritesButtonProps,
  PaginationButtonProps,
  PaginationProps,
  RestaurantType,
} from "@/types/restaurant";
import { calculateDistance } from "@/utils/caluclate-distance";
import { toast } from "sonner";

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
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const data = await res.json();
      console.error(data.message, data.detail);
      toast.error(data.message);
      return;
    }
    const data = await res.json();
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
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const data = await res.json();
      console.error(data.message, data.detail);
      toast.error(data.message);
      return;
    }
    const data = await res.json();
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
    scrollRef,
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
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const data = await res.json();
      console.error("data", data);
    }
    const data = await res.json();
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

    scrollRef.current?.scrollIntoView({
      behavior: "instant",
    });
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
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const data = await res.json();

      toast.error(data.message);
      return;
    }
    const data = await res.json();
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
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message);
      return;
    }
    const data = await res.json();
    toast.success(data.message);

    // return data.restaurant_id;
  } catch (e: unknown) {
    console.error("e", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};
