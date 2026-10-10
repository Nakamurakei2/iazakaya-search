"use client";

import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { Location, SearchMode, ShopsType } from "@/types/restaurant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaSpinner } from "react-icons/fa";
import { Dialog } from "@/components/dialog";
import { ConfirmDialog } from "@/components/confirmDailog";
import { Pagination } from "@/components/pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  favoriteRestaurantsFetch,
  restaurantFetch,
  searchRestaurantFetch,
} from "@/lib/api/api";
import { currentLocation } from "@/utils/location";
import { RecentSearch } from "@/components/recentSearch";
import { GenreSearch } from "@/components/genre";
import { RestaurantLists } from "@/components/restaurantLists";

type MainProps = {
  authorized: boolean;
};

export const LIMIT = 10;

export default function IzakayaSearchApp(props: MainProps) {
  const { authorized } = props;
  const queryClient = useQueryClient();
  const router = useRouter();

  // 検索状態はページ遷移後に戻ってきても復元できるようにする。
  const [stationName, setStationName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>(""); // 詳細ダイアログ表示するためのレストランID
  const [locationNotice, setLocationNotice] = useState<string>("");
  const [totalRestaurants, setTotalRestaurants] = useState<number>(0);
  const [currentLocationData, setCurrentLocationData] =
    useState<Location | null>(null); // 現在地格納
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode | undefined>(
    undefined,
  ); // 検索方法
  const [confirmTarget, setConfirmTarget] = useState<ShopsType | null>(null); // 削除確認ダイアログ
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   *
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStationName(sessionStorage.getItem("searchStationName") ?? "");

    setPage(Number(sessionStorage.getItem("searchPage") ?? "1"));

    setLocationNotice(sessionStorage.getItem("searchLocationNotice") ?? "");

    setTotalRestaurants(
      Number(sessionStorage.getItem("searchTotalRestaurants") ?? "0"),
    );

    const savedLocation = sessionStorage.getItem("currentLocationData");

    if (savedLocation) {
      setCurrentLocationData(JSON.parse(savedLocation));
    }

    const savedGenres = localStorage.getItem("savedGenres");

    if (savedGenres) {
      setSelectedGenres(JSON.parse(savedGenres));
    }

    const savedSearchMode = sessionStorage.getItem("searchMode");

    if (savedSearchMode) {
      setSearchMode(savedSearchMode as SearchMode);
    }
    setIsInitialized(true);
    console.log("test");
  }, []);
  /**
   * sessionStorageへ各検索内容を保存する
   */
  useEffect(() => {
    if (!isInitialized) return;

    sessionStorage.setItem("searchStationName", stationName);
    sessionStorage.setItem("searchPage", String(page));
    sessionStorage.setItem("searchLocationNotice", locationNotice);
    sessionStorage.setItem("searchTotalRestaurants", String(totalRestaurants));
    if (searchMode) {
      sessionStorage.setItem("searchMode", searchMode);
    }

    if (currentLocationData) {
      sessionStorage.setItem(
        "currentLocationData",
        JSON.stringify(currentLocationData),
      );
    }
  }, [
    stationName,
    page,
    locationNotice,
    totalRestaurants,
    currentLocationData,
    searchMode,
  ]);

  /**
   * 「お気に入り解除」ボタン押下時処理
   */
  const handleRemoveFavorites = () => {
    setConfirmTarget(selected);
  };

  /**
   * お気に入り削除ボタン押下時処理
   */
  const confirmRemoveFavorite = async (target: ShopsType): Promise<void> => {
    const { id } = target;

    try {
      const res = await fetch(`/api/restaurants/${id}/favorites`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message);
        return;
      }
      const data = await res.json();
      toast.success(data.message);
      setConfirmTarget(null); // モーダル閉じる
      setSelectedId(""); // 詳細モーダルを閉じる

      router.refresh(); // サーバーへ最新データを取得するリクエストを送り更新する
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    } catch (e: unknown) {
      if (e instanceof TypeError) {
        console.error("ネットワークエラーが発生しました:", e.message);
        // ユーザーへの通知: "インターネットに接続されていません。回線状況を確認してください。"
        toast.error(
          "インターネットに接続されていません。回線状況を確認してください。",
        );
        return;
      }

      console.error("予期せぬエラー", e);
      toast.error(
        "予期せぬエラーが発生しました。時間をおいてから再度実行してください",
      );
    }
  };

  /**
   * 現在地から検索
   */
  const handleLocationButtonClick = async () => {
    setSearchMode("location");
    setPage(1);
    setStationName("");
    setLocationNotice("現在地から");
    setIsAdvancedOpen(false);

    const results = await refetchLocation();
    if (results.isError) {
      toast.error(
        "店舗情報の取得に失敗しました。しばらく時間を置いてから再度実行してください。",
      );
    } else {
      setTotalRestaurants(results.data?.resultsAvailable);
      setCurrentLocationData({
        latitude: results.data!.latitude,
        longitude: results.data!.longitude,
      });
    }
  };

  /**
   * 「現在地から検索」ボタン押下時処理
   * No need for try catch.(tanstack query covers it)
   */
  const {
    data: restaurants,
    refetch: refetchLocation,
    isPending: isRestaurantsDataFetching,
  } = useQuery({
    queryKey: ["location", selectedGenres, page],
    queryFn: async () => {
      const { latitude, longitude } = currentLocationData
        ? currentLocationData
        : await currentLocation();

      return restaurantFetch({
        selectedGenres,
        latitude,
        longitude,
        start: (page - 1) * LIMIT + 1,
      });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  /**
   * お気に入り取得APIのusequery
   */
  const {
    data: favorites,
    isPending: isFavoriteIdsPending,
    isFetching: isFavoriteIdsFetching,
    isError: isFavoriteIdsError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => await favoriteRestaurantsFetch(),
  });

  /**
   * 検索欄からのレストラン情報検索
   */
  const handleSearch = () => {
    if (!stationName) {
      toast.error("駅名を入力してください。");
      return;
    }

    // 駅名を予測変換するためのAPIを実装

    setSearchMode("station");
    setPage(1);
    setLocationNotice(`${stationName}駅から`);
  };

  /**
   * 検索欄からのレストラン情報検索 tanstack query
   */
  const {
    data: searchData,
    isFetching: isSearchDataFetching,
    isError: isFetchingError,
  } = useQuery({
    queryKey: ["station", selectedGenres, stationName, page],
    queryFn: async () =>
      await searchRestaurantFetch({
        selectedGenres,
        stationName,
        startPage: (page - 1) * LIMIT + 1,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: searchMode === "station" && !!stationName,
  });

  useEffect(() => {
    if (searchMode === "station" && searchData?.resultsAvailable != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalRestaurants(searchData.resultsAvailable);

      if (searchData.station) {
        setLocationNotice(`${searchData.station}駅から`);
      }
    }
  }, [searchMode, searchData]);

  /**
   * ページネーション「<」ボタン
   */
  const handlePaginatePrevious = async () => {
    setPage((prev) => prev - 1); // re-runs tanstack query when state changes

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  /**
   * ページネーション「>」ボタン
   */
  const handlePaginateNext = async () => {
    setPage((prev) => prev + 1); // re-runs tanstack query when state changes

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  /**
   * ページネーションボタン
   */
  const handlePaginateButtonClick = (n: number) => {
    setPage(n);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const shops =
    searchMode === "location"
      ? (restaurants?.sortedRestaurants ?? [])
      : (searchData?.sortedRestaurants ?? []);
  const favoriteIds =
    favorites?.favoriteIds.map((favorite) => favorite.restaurant_id) ?? [];

  // UI表示用変数
  const displayShops = shops.map((shop) => ({
    ...shop,
    isFavorite: favoriteIds.includes(shop.id),
  }));
  const selected = displayShops?.find((s) => s.id === selectedId) || null;

  return (
    <>
      <main className="pt-24 px-container-margin max-w-[1200px] mx-auto grid grid-cols-4 md:grid-cols-12 gap-gutter">
        <section className="col-span-4 md:col-span-8 md:col-start-3 flex flex-col gap-sm mb-lg">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background text-center mb-xs">
            今夜のお店を探す
          </h2>
          <div className="relative w-full rounded-2xl bg-surface-bright shadow-[0px_10px_30px_rgba(255,140,0,0.08)] flex items-center overflow-hidden border border-surface-container-highest focus-within:border-primary transition-colors duration-300">
            <div className="pl-md flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined" data-icon="search">
                <Search />
              </span>
            </div>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-on-background font-body-lg text-body-lg px-sm py-4 placeholder-on-surface-variant/50"
              placeholder="駅名で検索（例：渋谷）"
              type="text"
              onChange={(e) => setStationName(e.target.value)}
            />
            <div className="pr-sm">
              <button
                onClick={() => handleSearch()}
                className="bg-primary-container text-on-primary-container px-sm py-2 rounded-xl font-label-bold text-label-bold hover:bg-primary-container/90 transition-colors active:scale-95"
              >
                検索
              </button>
            </div>
          </div>
          <button
            className={`${isRestaurantsDataFetching ? "aa" : "w-full md:w-auto md:self-center border-2 border-primary text-primary px-lg py-3 rounded-full font-label-bold text-label-bold flex items-center justify-center gap-xs hover:bg-primary hover:text-white transition-colors duration-300 active:scale-95 mt-xs"}`}
            onClick={handleLocationButtonClick}
            disabled={isRestaurantsDataFetching}
          >
            <span className="material-symbols-outlined" data-icon="near_me">
              {isRestaurantsDataFetching ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaLocationArrow />
              )}
            </span>
            {isRestaurantsDataFetching ? "読み込み中..." : "現在地周辺から探す"}
          </button>
        </section>
        <GenreSearch
          isAdvancedOpen={isAdvancedOpen}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          setIsAdvancedOpen={setIsAdvancedOpen}
        />
        <RecentSearch scrollRef={scrollRef} />

        <RestaurantLists
          isRestaurantsDataFetching={isRestaurantsDataFetching}
          displayShops={displayShops}
          totalRestaurants={totalRestaurants}
          setSelectedId={setSelectedId}
          locationNotice={locationNotice}
        />
      </main>

      {/* ページネーション */}
      {Math.ceil(totalRestaurants / LIMIT) > 1 ? (
        <Pagination
          page={page}
          totalRestaurants={Math.ceil(totalRestaurants / LIMIT)}
          handlePaginatePrevious={handlePaginatePrevious}
          handlePaginateNext={handlePaginateNext}
          handlePaginateButtonClick={(pageNumber: number) =>
            handlePaginateButtonClick(pageNumber)
          }
        />
      ) : (
        <div className="h-20"></div>
      )}

      {/* 詳細ダイアログ */}
      {selected && (
        <Dialog
          selected={selected}
          setSelectedId={setSelectedId}
          authorized={authorized}
          favoriteIds={favoriteIds}
          handleRemoveFavorites={handleRemoveFavorites}
          queryClient={queryClient}
        />
      )}

      {/* 削除確認ダイアログ */}
      {selected && confirmTarget && (
        <ConfirmDialog
          target={confirmTarget}
          setSelectedId={setSelectedId}
          confirmRemoveFavorite={confirmRemoveFavorite}
          setConfirmTarget={setConfirmTarget}
        />
      )}
    </>
  );
}
