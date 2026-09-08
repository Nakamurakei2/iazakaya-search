"use client";

import { useState, useRef } from "react";
import { Search, Tags } from "lucide-react";
import {
  GENRE_STYLE,
  Location,
  SearchMode,
  ShopsType,
} from "@/types/restaurant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaStar } from "react-icons/fa";
import { MdOutlineRestaurant } from "react-icons/md";
import { IoBeer } from "react-icons/io5";
import { IoMdTrain } from "react-icons/io";
import { Dialog } from "@/components/dialog";
import { ConfirmDialog } from "@/components/confirmDailog";
import { Pagination } from "@/components/pagination";
import { useQuery } from "@tanstack/react-query";
import {
  favoriteRestaurantsFetch,
  restaurantFetch,
  searchRestaurantFetch,
} from "@/lib/api/api";
import { currentLocation } from "@/utils/location";

type MainProps = {
  authorized: boolean;
};

const GENRE_OPTIONS = [
  { code: "G001", name: "居酒屋" },
  { code: "G002", name: "ダイニングバー・バル" },
  { code: "G003", name: "創作料理" },
  { code: "G004", name: "和食" },
  { code: "G005", name: "洋食" },
  { code: "G006", name: "イタリアン・フレンチ" },
  { code: "G007", name: "中華" },
  { code: "G008", name: "焼肉・ホルモン" },
  { code: "G009", name: "アジア・エスニック料理" },
  { code: "G010", name: "各国料理" },
  { code: "G011", name: "カラオケ・パーティ" },
  { code: "G012", name: "バー・カクテル" },
  { code: "G013", name: "ラーメン" },
  { code: "G014", name: "カフェ・スイーツ" },
  { code: "G015", name: "その他グルメ" },
  { code: "G017", name: "韓国料理" },
  { code: "G016", name: "お好み焼き・もんじゃ" },
] as const;

export const LIMIT = 10;

export default function IzakayaSearchApp(props: MainProps) {
  const { authorized } = props;
  const router = useRouter();

  const [stationName, setStationName] = useState<string>(""); // 入力した駅名
  const [page, setPage] = useState<number>(1); // ページネーション用の現在どのページを表す
  const [selectedId, setSelectedId] = useState<string>(""); // 詳細ダイアログ表示するためのレストランID
  const [locationNotice, setLocationNotice] = useState<string>(""); // 距離についての文言
  const [totalRestaurants, setTotalRestaurants] = useState<number>(0); // 該当したレストラン総数
  const [startPage, setStartPage] = useState(1); // 検索の開始位置
  const [currentLocationData, setCurrentLocationData] =
    useState<Location | null>(null); // 現在地格納
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(() => {
    // server sideでのレンダリングでエラーになる可能性あり
    if (typeof window === "undefined") {
      return [];
    }
    const savedGenres = localStorage.getItem("savedGenres");
    return savedGenres ? JSON.parse(savedGenres) : [];
  });
  const [searchMode, setSearchMode] = useState<SearchMode>(); // 検索方法
  const [confirmTarget, setConfirmTarget] = useState<ShopsType | null>(null); // 削除確認ダイアログ
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleGenre = (code: string) => {
    setSelectedGenres((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleClearGenres = () => {
    localStorage.removeItem("savedGenres");
    setSelectedGenres([]);
  };

  const handleApplyAdvancedSearch = () => {
    localStorage.setItem("savedGenres", JSON.stringify(selectedGenres));
    setIsAdvancedOpen(false);
  };

  /**
   * 「お気に入り解除」ボタン押下時処理
   */
  const handleRemoveFavorites = () => {
    setConfirmTarget(selected);
  };

  /**
   * 「削除する」ボタン押下時処理
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
      const restaurantId = data.restaurantId;
      // setFavoriteIds((prevId) => prevId.filter((id) => id !== restaurantId)); // お気に入りのstateからも削除する

      router.refresh(); // サーバーへ最新データを取得するリクエストを送り更新する
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
    setStartPage(1);
    setStationName("");
    setLocationNotice("現在地から");
    setIsAdvancedOpen(false);

    const results = await refetchLocation();
    if (results.isError) {
      toast.error("店舗情報の取得に失敗しました。");
    } else {
      setTotalRestaurants(results.data?.resultsAvailable);
      setCurrentLocationData({
        latitude: results.data!.latitude,
        longitude: results.data!.longitude,
      });
      setStartPage(results.data!.results_start);
    }
  };

  /**
   * 「現在地から検索」ボタン押下時処理
   * No need for try catch.(tanstack query covers it)
   */
  const {
    data: restaurants,
    refetch: refetchLocation,
    isPending: isRestaurantsDataPending,
    isFetching: isRestaurantsDataFetching,
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
    staleTime: 5 * 60 * 1000, // for 5 minutes
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
    queryKey: [],
    queryFn: async () => await favoriteRestaurantsFetch(),
  });

  /**
   * 検索欄からのレストラン情報検索
   */
  const handleSearch = async () => {
    if (!stationName) {
      toast.error("駅名を入力してください。");
    }
    setSearchMode("station");
    const result = await searchRefetch();
    setPage(1);
    setLocationNotice(`${result.data?.station}駅から`);
    setTotalRestaurants(result.data!.resultsAvailable);
  };

  /**
   * 検索欄からのレストラン情報検索 tanstack query
   */
  const {
    data: searchData,
    refetch: searchRefetch,
    isFetching: isSearchDataFetching,
    isError: isFetchingError,
  } = useQuery({
    queryKey: ["station", page, stationName],
    queryFn: async () =>
      await searchRestaurantFetch({
        selectedGenres,
        stationName,
        startPage,
      }),
    staleTime: 5 * 60 * 1000, // stale every 5 minutes
    enabled: false,
  });

  /**
   * 詳細モーダル展開
   */
  const handleDescriptionModal = async (shop: ShopsType) => {
    setSelectedId(shop.id);
    try {
      const res = await fetch(`/api/restaurants/${shop.id}/recent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(shop),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("data!!!", data);
        return;
      }
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

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
            className="w-full md:w-auto md:self-center border-2 border-primary text-primary px-lg py-3 rounded-full font-label-bold text-label-bold flex items-center justify-center gap-xs hover:bg-primary hover:text-white transition-colors duration-300 active:scale-95 mt-xs"
            disabled={isRestaurantsDataFetching}
            onClick={handleLocationButtonClick}
          >
            <span className="material-symbols-outlined" data-icon="near_me">
              <FaLocationArrow />
            </span>
            現在地周辺から探す
          </button>
        </section>
        <section className="genre-search">
          {/* ヘッダー */}
          <div className="genre-search-header">
            <div className="genre-search-title">
              <Tags size={20} />
              <h4>ジャンルから探す</h4>
            </div>

            <button
              type="button"
              className="genre-filter-button"
              onClick={() => setIsAdvancedOpen((p) => !p)}
            >
              <Tags size={16} />
              <span>詳細絞り込み</span>
            </button>
          </div>

          {/* ジャンル一覧 */}

          {isAdvancedOpen && (
            <div className="advanced-panel">
              <div className="genre-chip-row">
                {GENRE_OPTIONS.map((g) => {
                  const active = selectedGenres.includes(g.code);
                  const color =
                    GENRE_STYLE[g.code as keyof typeof GENRE_STYLE]?.c ??
                    "#8C6A4E";
                  return (
                    <button
                      type="button"
                      key={g.code}
                      className={`genre-chip-btn ${
                        active ? "genre-chip-btn--active" : ""
                      }`}
                      style={
                        active
                          ? { background: color, borderColor: color }
                          : { borderColor: color, color }
                      }
                      onClick={() => toggleGenre(g.code)}
                      aria-pressed={active}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>

              <div className="advanced-panel-actions">
                <button
                  type="button"
                  className="advanced-clear-btn"
                  onClick={handleClearGenres}
                  disabled={selectedGenres.length === 0}
                >
                  クリア
                </button>
                <button
                  type="button"
                  className="advanced-apply-btn"
                  onClick={handleApplyAdvancedSearch}
                >
                  この条件で登録
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="recent-search-section" ref={scrollRef}>
          <h3 className="recent-search-title">最近の検索</h3>

          <div className="recent-search-list">
            <button className="recent-search-item">
              <IoMdTrain className="recent-search-icon recent-search-icon-primary" />
              <span>新宿駅</span>
            </button>

            <button className="recent-search-item">
              <IoMdTrain className="recent-search-icon recent-search-icon-primary" />
              <span>渋谷駅</span>
            </button>

            <button className="recent-search-item">
              <MdOutlineRestaurant className="recent-search-icon recent-search-icon-secondary" />
              <span>焼き鳥</span>
            </button>

            <button className="recent-search-item">
              <IoBeer className="recent-search-icon recent-search-icon-secondary" />
              <span>クラフトビール</span>
            </button>
          </div>
        </section>
        <section className="col-span-4 md:col-span-12">
          {/* 一覧 */}
          {!isRestaurantsDataPending && displayShops?.length === 0 && (
            <>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-xs">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="star"
                    data-weight="fill"
                  >
                    <FaStar />
                  </span>
                  周辺のお店
                </h3>
                <p className="recent-search-icon-secondary">
                  {totalRestaurants !== 0 && `${totalRestaurants}件`}
                </p>
              </div>
              <section className="w-full px-container-margin pt-md pb-lg flex flex-col items-center text-center">
                {/* Lantern */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-sm">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />

                  <svg
                    className="relative w-28 h-28 text-surface-variant filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                    fill="none"
                    viewBox="0 0 120 120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Roof */}
                    <path
                      d="M35 34C35 34 45 28 60 28C75 28 85 34 85 34L88 38H32L35 34Z"
                      fill="#353534"
                    />

                    <path d="M57 20V28H63V20H57Z" fill="#a48c7a" />

                    <circle
                      cx="60"
                      cy="18"
                      r="5"
                      stroke="#a48c7a"
                      strokeWidth="2.5"
                    />

                    {/* Top frame */}
                    <rect
                      fill="#564334"
                      height="5"
                      rx="2.5"
                      width="48"
                      x="36"
                      y="38"
                    />

                    {/* Lantern body */}
                    <ellipse cx="60" cy="66" fill="#201f1f" rx="28" ry="25" />

                    <circle
                      cx="60"
                      cy="66"
                      fill="#ffb77d"
                      fillOpacity="0.18"
                      r="16"
                    />

                    <circle
                      cx="60"
                      cy="66"
                      fill="#ff8c00"
                      fillOpacity="0.25"
                      r="7"
                    />

                    {/* Rib lines */}
                    <path
                      d="M44 48C41 55 41 77 44 84"
                      stroke="#353534"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M76 48C79 55 79 77 76 84"
                      stroke="#353534"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M60 43V89"
                      stroke="#353534"
                      strokeDasharray="3 2"
                      strokeWidth="1.5"
                    />

                    {/* Sleeping eyes */}
                    <path
                      d="M50 63C50 66 54 66 54 63"
                      stroke="#a48c7a"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />

                    <path
                      d="M66 63C66 66 70 66 70 63"
                      stroke="#a48c7a"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />

                    {/* Cheeks */}
                    <ellipse
                      cx="48"
                      cy="68"
                      fill="#ffb4ab"
                      fillOpacity="0.4"
                      rx="2.5"
                      ry="1.5"
                    />

                    <ellipse
                      cx="72"
                      cy="68"
                      fill="#ffb4ab"
                      fillOpacity="0.4"
                      rx="2.5"
                      ry="1.5"
                    />

                    {/* Bottom frame */}
                    <rect
                      fill="#564334"
                      height="5"
                      rx="2.5"
                      width="44"
                      x="38"
                      y="89"
                    />

                    {/* Tassel */}
                    <path d="M60 94V102" stroke="#a48c7a" strokeWidth="2" />

                    <circle cx="60" cy="104" fill="#c68315" r="3" />

                    {/* Floating sparks */}
                    <circle
                      cx="86"
                      cy="40"
                      fill="#ffb77d"
                      opacity="0.6"
                      r="1.5"
                    />

                    <circle
                      cx="94"
                      cy="30"
                      fill="#ff8c00"
                      opacity="0.4"
                      r="2.5"
                    />

                    <circle
                      cx="28"
                      cy="45"
                      fill="#ffddb6"
                      opacity="0.5"
                      r="1"
                    />
                  </svg>

                  <div className="absolute -bottom-1 bg-surface-container-highest/90 px-2.5 py-0.5 rounded-full shadow-sm">
                    <span className="font-label-sm text-label-sm text-primary tracking-widest font-bold">
                      Zzz...
                    </span>
                  </div>
                </div>

                {/* Message */}
                <h1 className="font-headline-md text-headline-md text-on-surface mb-xs tracking-tight">
                  条件に一致するお店が
                  <br />
                  見つかりませんでした
                </h1>

                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed mb-md">
                  指定されたエリア・条件の組み合わせでは該当店舗がありません。
                  条件を少し緩めるか、別のキーワードでお試しください。
                </p>
              </section>
            </>
          )}
          {displayShops?.map((shop) => {
            const code = shop.genre.code;
            const style = GENRE_STYLE[code as keyof typeof GENRE_STYLE] || {
              c: "#8C6A4E",
            };

            return (
              <div
                key={shop.id}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-5"
                onClick={() => handleDescriptionModal(shop)}
              >
                <article className="bg-[#ffffff] text-[#121212] rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(255,140,0,0.08)] flex flex-col group cursor-pointer hover:shadow-[0px_15px_40px_rgba(255,140,0,0.15)] transition-shadow duration-300">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div
                      className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                      data-alt="A warm, inviting photo of a modern Japanese izakaya interior, featuring glowing paper lanterns, rich wooden counters, and a lively atmosphere. A plate of freshly grilled yakitori is in the foreground, illuminated by soft amber lighting against a dark, moody background. High quality, appetizing."
                      style={{
                        backgroundImage: `url(${shop.photo.pc.l})`,
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <div className="p-sm flex flex-col gap-base flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline-md text-[20px] leading-[28px] font-bold">
                        {shop.name}
                      </h4>
                      <span className="text-surface-variant font-label-sm whitespace-nowrap mt-1">
                        {locationNotice && (
                          <span>
                            {locationNotice}{" "}
                            <b className="font-bold">
                              {shop.distanceKm < 1
                                ? `${Math.round(shop.distanceKm * 1000)}m`
                                : `${shop.distanceKm.toFixed(2)}km`}
                            </b>
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-surface-variant font-body-md text-body-md line-clamp-2">
                      {shop.catch}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-sm">
                      <span
                        className="genre-tag"
                        style={{
                          backgroundColor:
                            GENRE_STYLE[shop.genre.code]?.c ?? "#888888",
                          borderColor:
                            GENRE_STYLE[shop.genre.code]?.c ?? "#888888",
                        }}
                      >
                        {shop.genre.name}
                      </span>

                      {shop.sub_genre ? (
                        <span
                          className="genre-tag"
                          style={{
                            backgroundColor:
                              GENRE_STYLE[shop.sub_genre.code]?.c ?? "#888888",
                            borderColor:
                              GENRE_STYLE[shop.sub_genre.code]?.c ?? "#888888",
                          }}
                        >
                          {shop.sub_genre.name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </section>
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
