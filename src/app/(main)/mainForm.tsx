"use client";

import { useEffect, useState, useRef } from "react";
import { Location, SearchMode, ShopsType } from "@/types/restaurant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { SearchForm } from "@/components/searchForm";

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
   * 「現在地から検索」ボタン押下時処理
   * geoLocationにて現在地から近くのレストランの情報を取得
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
   * 「現在地から検索」ボタン押下時のuseQuery処理（fetch処理部分）
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
   * お気に入り取得APIのusequery
   */
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => await favoriteRestaurantsFetch(),
  });

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

  // お気に入り登録したレストランのidを付与
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
        <SearchForm
          setStationName={setStationName}
          isRestaurantsDataFetching={isRestaurantsDataFetching}
          handleSearch={handleSearch}
          handleLocationButtonClick={handleLocationButtonClick}
        />

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
          queryClient={queryClient}
          setConfirmTarget={setConfirmTarget}
        />
      )}

      {/* 削除確認ダイアログ */}
      {selected && confirmTarget && (
        <ConfirmDialog
          target={confirmTarget}
          setSelectedId={setSelectedId}
          setConfirmTarget={setConfirmTarget}
          queryClient={queryClient}
          router={router}
        />
      )}
    </>
  );
}
