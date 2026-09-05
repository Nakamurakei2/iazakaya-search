"use client";

import { useState, useRef } from "react";
import { Search, Tags } from "lucide-react";
import {
  handleLocationSearch,
  handlePaginateButtonClick,
  handlePaginateNext,
  handlePaginatePrevious,
  handleSearch,
} from "@/services/restaurant-api";
import {
  FavoriteItem,
  GENRE_STYLE,
  Location,
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

type MainProps = {
  authorized: boolean;
};

const pageSize_OPTIONS = [5, 10, 20, 30] as const;

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
  { code: "G016", name: "お好み焼き・もんじゃ" },
  { code: "G017", name: "カフェ・スイーツ" },
  { code: "G014", name: "その他" },
] as const;

export default function IzakayaSearchApp(props: MainProps) {
  const { authorized } = props;
  const router = useRouter();

  const [stationName, setStationName] = useState<string>("");
  const [shops, setShops] = useState<ShopsType[]>(); // 表示用レストランデータ(距離含む)
  const [page, setPage] = useState<number>(1); // ページネーション用の現在どのページを表す
  const [selectedId, setSelectedId] = useState<string>(""); // 詳細ダイアログ表示するためのレストランID
  const [isLocating, setIsLocating] = useState(false); // 読み込み中を表す
  const [locationNotice, setLocationNotice] = useState<string>(""); // 距離についての文言
  const [totalRestaurants, setTotalRestaurants] = useState<number>(0); // 該当したレストラン総数
  const [pageSize, setPageSize] = useState(10); // 取得件数
  const [startPage, setStartPage] = useState(1); // 検索の開始位置
  const [currentLocationData, setCurrentLocationData] =
    useState<Location | null>(null); // 現在地格納
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // お気に入り登録
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [confirmTarget, setConfirmTarget] = useState<ShopsType | null>(null); // 削除確認ダイアログ
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = shops?.find((s) => s.id === selectedId) || null;

  const toggleGenre = (code: string) => {
    setSelectedGenres((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleClearGenres = () => {
    setSelectedGenres([]);
  };

  const handleApplyAdvancedSearch = () => {
    // 検索した内容を保持したい
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
      toast.success(data.message); // 店名込みで表示させた方が良い？
      setConfirmTarget(null); // モーダル閉じる
      setSelectedId(""); // 詳細モーダルを閉じる
      const restaurantId = data.restaurantId;
      setFavoriteIds((prevId) => prevId.filter((id) => id !== restaurantId)); // お気に入りのstateからも削除する

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
        "予期せぬエラーが発生しました。時間を押してから再度実行してください",
      );
    }
  };

  /**
   * 「現在地から検索」ボタン押下時処理
   */
  const handleLocationButtonClick = async () => {
    setStartPage(1);

    handleLocationSearch({
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
    });

    // お気に入り登録したレストランID取得
    try {
      const res = await fetch("/api/restaurants/favorites", {
        method: "GET",
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error(data.message);
        return;
      }
      const datas = await res.json();
      const favoriteRestaurants: FavoriteItem[] = datas.favoriteRestaurants;
      const restaurantIds = favoriteRestaurants.map((data) => {
        return data.restaurant_id;
      });

      setFavoriteIds(restaurantIds);
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
        "予期せぬエラーが発生しました。時間を押してから再度実行してください",
      );
    }

    // 詳細検索窓を閉じる
    setIsAdvancedOpen(false);
  };

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

  return (
    <>
      <main className="pt-24 px-container-margin max-w-[1200px] mx-auto grid grid-cols-4 md:grid-cols-12 gap-gutter">
        <section className="col-span-4 md:col-span-8 md:col-start-3 flex flex-col gap-sm mb-lg">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background text-center mb-xs">
            今夜の居酒屋を探す
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
                onClick={() =>
                  handleSearch({
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
                  })
                }
                className="bg-primary-container text-on-primary-container px-sm py-2 rounded-xl font-label-bold text-label-bold hover:bg-primary-container/90 transition-colors active:scale-95"
              >
                検索
              </button>
            </div>
          </div>
          <button
            className="w-full md:w-auto md:self-center border-2 border-primary text-primary px-lg py-3 rounded-full font-label-bold text-label-bold flex items-center justify-center gap-xs hover:bg-primary hover:text-white transition-colors duration-300 active:scale-95 mt-xs"
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

          {/* 一覧 */}
          {shops?.length === 0 && (
            <div className="empty-state">
              <p className="empty-title">該当するお店が見つかりませんでした</p>

              <p className="empty-body">
                駅名や店名を変えて、もう一度お試しください。
              </p>
            </div>
          )}
          {shops?.map((shop) => {
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
      {Math.ceil(totalRestaurants / pageSize) > 1 && (
        <Pagination
          page={page}
          totalRestaurants={Math.ceil(totalRestaurants / pageSize)}
          handlePaginatePrevious={() =>
            handlePaginatePrevious({
              pageSize,
              startPage,
              currentLocationData,
              setShops,
              setPage,
              setStartPage,
              scrollRef,
            })
          }
          handlePaginateNext={() =>
            handlePaginateNext({
              pageSize,
              startPage,
              currentLocationData,
              setShops,
              setPage,
              setStartPage,
              scrollRef,
            })
          }
          handlePaginateButtonClick={(pageNumber: number) =>
            handlePaginateButtonClick({
              pageNumber,
              setStartPage,
              pageSize,
              currentLocationData,
              setShops,
              setPage,
              scrollRef,
            })
          }
        />
      )}

      {/* 詳細ダイアログ */}
      {selected && (
        <Dialog
          selected={selected}
          setSelectedId={setSelectedId}
          authorized={authorized}
          favoriteIds={favoriteIds}
          setFavoriteIds={setFavoriteIds}
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
