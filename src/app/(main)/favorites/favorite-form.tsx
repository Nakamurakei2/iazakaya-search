"use client";

import { ConfirmDialog } from "@/components/confirmDailog";
import { Dialog } from "@/components/dialog";
import { Pagination } from "@/components/pagination";
import {
  FavoriteItem,
  GENRE_STYLE,
  RestaurantType,
  ShopsType,
} from "@/types/restaurant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaBookmark } from "react-icons/fa6";
import { MdFavorite, MdFavoriteBorder, MdSearch } from "react-icons/md";
import { toast } from "sonner";

type SortKey = "recent" | "name";

type Props = {
  shops: ShopsType[];
  restaurantsTotal: number;
};

export default function FavoritesForm(props: Props) {
  const { shops, restaurantsTotal } = props;
  const router = useRouter();

  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [favorites, setFavorites] = useState<ShopsType[]>(shops); // 現在表示中のお気に入り一覧
  const [page, setPage] = useState<number>(1); // 現在のページ番号（1始まり）
  const [selectedId, setSelectedId] = useState<string>("");
  const [pageSize, setPageSize] = useState(10); // 取得件数
  const [confirmTarget, setConfirmTarget] = useState<ShopsType | null>(null);
  const [offset, setOffset] = useState(0); // offset
  const selected = favorites?.find((s) => s.id === selectedId) || null;
  const scrollRef = useRef<HTMLDivElement>(null);

  const idList = favorites.map((item) => item.id);

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

      // ローカルの一覧・件数も即時反映
      setFavorites((prev) => prev.filter((f) => f.id !== id));

      setConfirmTarget(null);
      setSelectedId("");

      router.refresh(); // サーバー側のキャッシュ等も同期
    } catch (e: unknown) {
      if (e instanceof TypeError) {
        console.error("ネットワークエラーが発生しました:", e.message);
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
   * ページネーション前へ進むボタン
   */
  const handlePaginatePrevious = async () => {
    try {
      const params = new URLSearchParams({
        offset: String((page - 2) * pageSize),
        limit: String(pageSize),
      });

      const res = await fetch(
        `/api/restaurants/favorites?${params.toString()}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("data", data);
        return;
      }

      const data = await res.json();
      const previousRestaurantsIds: FavoriteItem[] = data.favoriteRestaurants;
      // 外部API呼び出し
      const restaurants = await Promise.all(
        previousRestaurantsIds.map(async ({ restaurant_id, created_at }) => {
          const res = await fetch(
            `/api/restaurants?restaurant_id=${restaurant_id}`,
          );
          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          return {
            ...data.shop[0],
            created_at,
          };
        }),
      );

      window.scrollTo({ top: 0, behavior: "instant" });
      setFavorites(restaurants);
      setPage((prev) => prev - 1);
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  /**
   * ページネーション次へ進むボタン
   */
  const handlePaginateNext = async () => {
    try {
      const params = new URLSearchParams({
        offset: String(page * pageSize),
        limit: String(pageSize),
      });

      const res = await fetch(
        `/api/restaurants/favorites?${params.toString()}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("data", data);
        return;
      }

      const data = await res.json();
      const nextRestaurantsIds: FavoriteItem[] = data.favoriteRestaurants;
      // 外部API呼び出し
      const restaurants = await Promise.all(
        nextRestaurantsIds.map(async ({ restaurant_id, created_at }) => {
          const res = await fetch(
            `/api/restaurants?restaurant_id=${restaurant_id}`,
          );
          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          return {
            ...data.shop[0],
            created_at,
          };
        }),
      );

      window.scrollTo({ top: 0, behavior: "instant" });
      setFavorites(restaurants);
      setPage((prev) => prev + 1);
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  /**
   * ページネーションのボタン
   */
  const handlePaginateButtonClick = async (n: number) => {
    try {
      const params = new URLSearchParams({
        offset: String((n - 1) * pageSize),
        limit: String(pageSize),
      });

      const res = await fetch(
        `/api/restaurants/favorites?${params.toString()}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("data", data);
        return;
      }

      const data = await res.json();
      const nextRestaurantsIds: FavoriteItem[] = data.favoriteRestaurants;
      // 外部API呼び出し
      const restaurants = await Promise.all(
        nextRestaurantsIds.map(async ({ restaurant_id, created_at }) => {
          const res = await fetch(
            `/api/restaurants?restaurant_id=${restaurant_id}`,
          );
          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          return {
            ...data.shop[0],
            created_at,
          };
        }),
      );

      window.scrollTo({ top: 0, behavior: "instant" });
      setFavorites(restaurants);
      setPage(n);
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1]" ref={scrollRef}>
        {/* Main */}
        <div className="mx-auto max-w-[1200px] px-5 pt-24">
          {/* Page Title */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-[28px] font-bold leading-9 text-[#ffb77d] md:text-[32px] md:leading-10">
                Favorites
              </h2>

              <p className="text-[14px] leading-6 text-[#ddc1ae]">
                Your saved spots for the perfect night out.
              </p>
            </div>

            <div className="flex items-center gap-1.5 justify-center flex-row text-[14px] rounded-full bg-[#c68315]/20 px-3 py-1 text-sm font-bold text-[#ffb95a]">
              <FaBookmark />
              <span>{restaurantsTotal}</span>
            </div>
          </div>

          {/* Favorites */}
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  onClick={() => setSelectedId(favorite.id)}
                  className="relative overflow-hidden rounded-[24px] bg-[#2a2a2a] shadow-[0px_10px_30px_rgba(255,140,0,0.08)] transition-transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <img
                      src={favorite.photo.pc.l}
                      alt={favorite.name}
                      className="h-full w-full object-cover"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Genre / Rating */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between" />

                    {/* Favorite Button */}
                    <button
                      type="button"
                      aria-label={`${favorite.name}をお気に入りから削除`}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#131313]/50 text-[#ffb77d] backdrop-blur-md transition-colors hover:bg-[#131313]/80"
                    >
                      <MdFavorite className="text-xl" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="mb-1 text-xl font-bold leading-8 text-[#e5e2e1]">
                      {favorite.name}
                    </h3>

                    <p>{favorite.catch}</p>
                    <div className="flex flex-wrap gap-2 pt-sm rounded-3xl mt-3 mb-5">
                      <span
                        className="genre-tag genre-tag-custom"
                        style={{
                          backgroundColor:
                            GENRE_STYLE[favorite.genre.code]?.c ?? "#888888",
                          borderColor:
                            GENRE_STYLE[favorite.genre.code]?.c ?? "#888888",
                        }}
                      >
                        {favorite.genre.name}
                      </span>

                      {favorite.sub_genre ? (
                        <span
                          className="genre-tag genre-tag-custom"
                          style={{
                            backgroundColor:
                              GENRE_STYLE[favorite.sub_genre.code]?.c ??
                              "#888888",
                            borderColor:
                              GENRE_STYLE[favorite.sub_genre.code]?.c ??
                              "#888888",
                          }}
                        >
                          {favorite.sub_genre.name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#353534] opacity-50">
                <MdFavoriteBorder className="text-[64px] text-[#ddc1ae]" />
              </div>

              <h3 className="mb-2 text-2xl font-bold leading-8 text-[#e5e2e1]">
                No favorites yet
              </h3>

              <p className="mb-8 max-w-sm text-[16px] leading-6 text-[#ddc1ae]">
                Start exploring and save your favorite Izakayas for your next
                night out.
              </p>

              <Link
                href="/"
                className="flex items-center gap-2 rounded-full bg-[#ffb77d] px-8 py-4 text-sm font-bold text-[#4d2600] transition-colors hover:bg-[#ffdcc3]"
              >
                <MdSearch className="text-xl" />
                Go Search
              </Link>
            </div>
          )}
        </div>
      </div>
      <Pagination
        page={page}
        totalRestaurants={Math.ceil(restaurantsTotal / pageSize)}
        handlePaginatePrevious={handlePaginatePrevious}
        handlePaginateNext={handlePaginateNext}
        handlePaginateButtonClick={handlePaginateButtonClick}
      />

      {/* 詳細ダイアログ */}
      {selected && (
        <Dialog
          selected={selected}
          setSelectedId={setSelectedId}
          authorized={true}
          favoriteIds={idList}
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
