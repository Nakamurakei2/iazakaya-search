"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  HeartOff,
  MapPin,
  Wallet,
  ChevronDown,
  Flame,
  X,
  Users,
  CalendarCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { FavoriteItem, GENRE_STYLE, RestaurantType } from "@/types/restaurant";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import { useRouter } from "next/navigation";

type SortKey = "recent" | "name";
type FavoriteFromProps = {
  data: RestaurantType[];
  totalFavorites: string;
};

const LIMIT = 20;

export default function FavoriteForm(props: FavoriteFromProps) {
  const { data, totalFavorites } = props;

  const router = useRouter();

  const [favorites, setFavorites] = useState<RestaurantType[]>(data);
  const [selectedId, setSelectedId] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirmTarget, setConfirmTarget] = useState<RestaurantType | null>(
    null,
  ); // 削除確認ダイアログ
  const confirmDialogRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const selected = favorites.find((s) => s.id === selectedId) || null;

  const paginateTotalPage = Math.ceil(Number(totalFavorites) / LIMIT); // ページネーションの合計ページ数

  useEffect(() => {
    if (selected && dialogRef.current) dialogRef.current.focus();
  }, [selected]);

  // 並び替え後のレストラン
  const sortFavorites = (favorites: RestaurantType[], sortKey: SortKey) => {
    return [...favorites].sort((a, b) => {
      if (sortKey === "name") {
        return a.name_kana.localeCompare(b.name_kana, "ja");
      }

      if (!a.created_at) return 1;
      if (!b.created_at) return -1;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  };
  const sortedFavorites = sortFavorites(favorites, sortKey);

  const handleRemoveFavorite = () => {
    // 削除確認ダイアログを表示させる
    setConfirmTarget(selected);
  };

  /**
   * 「キャンセル」ボタン押下時処理
   */
  const cancelRemoveFavorite = () => {
    setConfirmTarget(null);
  };

  /**
   * 「削除する」ボタン押下時処理
   */
  const confirmRemoveFavorite = async (
    target: RestaurantType,
  ): Promise<void> => {
    const { id } = target;
    try {
      const res = await fetch(`/api/restaurants/${id}/favorites`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.message);
        return;
      }
      toast.success(resData.message); // 店名込みで表示させた方が良い？
      setConfirmTarget(null); // モーダル閉じる
      setSelectedId(""); // 詳細モーダルを閉じる

      // ★ 併せて、削除した店舗をこの場で favorites からも取り除く
      //   （router.refresh() 完了までのタイムラグで一覧に残って見えるのを防ぐ）
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
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
   * ページネーションの前ボタン押下時処理
   */
  const handlePaginatePrevious = async () => {
    // 1ページ目より前には戻れない
    if (currentPage <= 1) return;

    const prevPage = currentPage - 1;
    const offset = LIMIT * (prevPage - 1);

    const prevFavorites = await fetchFavoritesPage(offset);
    if (prevFavorites === null) return; // エラー時は toast 済みなので何もしない

    setFavorites(prevFavorites);
    setCurrentPage(prevPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  /**
   * ページネーション次ボタン押下時処理
   */
  const handlePaginateNext = async () => {
    const nextPage = currentPage + 1;
    const offset = LIMIT * currentPage; // = LIMIT * (nextPage - 1)

    const nextFavorites = await fetchFavoritesPage(offset);
    if (nextFavorites === null) return; // エラー時は toast 済みなので何もしない

    setFavorites(nextFavorites);
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  /**
   * ページネーションのボタン押下時処理
   */
  const handlePaginateButtonClick = async (num: number) => {
    const nextFavorites = await fetchFavoritesPage((num - 1) * LIMIT);
    if (nextFavorites === null) return; // エラー時は toast 済みなので何もしない

    setFavorites(nextFavorites);
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  /**
   * 「予約する」ボタン押下時処理
   */
  const handleReserveButtonClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page">
      <div className="ambient-glow" aria-hidden="true" />

      {/* ヘッダー */}
      <header className="header">
        <div className="brand-row">
          <span className="lantern-dot" aria-hidden="true" />
          <h1 className="brand-title">お気に入り</h1>
        </div>
        <p className="brand-sub">保存した店舗はここからいつでも確認できます</p>
      </header>

      <div className="display-row">
        <div className="result-meta margin-none">
          <span>{totalFavorites}件 保存中</span>
        </div>

        <div className="sort-select-wrap">
          <div className="sort-select-inner">
            <select
              className="sort-select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              aria-label="お気に入りの並び替え"
            >
              <option value="recent">追加した順</option>
              <option value="name">店名順</option>
            </select>
            <ChevronDown
              size={14}
              className="sort-select-caret"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* 一覧 */}
      <main className="list">
        {favorites.length === 0 && (
          <div className="empty-state favorite-empty-state">
            <div className="favorite-empty-icon">
              <HeartOff size={26} />
            </div>
            <p className="empty-title">お気に入りはまだありません</p>
            <p className="empty-body">
              気になったお店をハートマークでお気に入りに追加すると、ここに表示されます。
            </p>
            <Link href="/" className="submit-btn favorite-empty-cta">
              お店を探す
            </Link>
          </div>
        )}

        {sortedFavorites.map((shop) => {
          const style = GENRE_STYLE[shop.genre.code] || { c: "#8C6A4E" };
          return (
            <div key={shop.id} className="card favorite-card">
              <div
                className="card-stripe"
                style={{ background: style.c }}
                aria-hidden="true"
              />

              <button
                type="button"
                className="card-body favorite-card-body"
                onClick={() => setSelectedId(shop.id)}
                aria-haspopup="dialog"
              >
                <div className="card-top-row">
                  <h2 className="card-name">{shop.name}</h2>

                  <div className="genre-column">
                    <span
                      className="genre-tag"
                      style={{ color: style.c, borderColor: style.c }}
                    >
                      {shop.genre.name}
                    </span>

                    {shop.sub_genre ? (
                      <span
                        className="genre-tag"
                        style={{
                          color:
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

                <div className="card-meta-row">
                  <span className="meta-item">
                    <MapPin size={12} className="meta-icon" />
                    {shop.station_name}駅
                  </span>
                  <span className="meta-item">
                    <Wallet size={12} className="meta-icon" />
                    {shop.budget.name}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </main>

      {/* 詳細ダイアログ */}
      {selected && (
        <div className="overlay" onClick={() => setSelectedId("")}>
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header-img">
              <Flame size={34} className="dialog-flame" />
              <button
                className="dialog-close"
                onClick={() => setSelectedId("")}
                aria-label="閉じる"
              >
                <X size={18} />
              </button>
            </div>

            <div className="dialog-scroll">
              <div className="dialog-top-row">
                <h2 id="dialog-title" className="dialog-title">
                  {selected.name}
                </h2>
                <div className="genre-column">
                  <span
                    className="genre-tag"
                    style={{
                      color: (GENRE_STYLE[selected.genre.code] || {}).c,
                      borderColor: (GENRE_STYLE[selected.genre.code] || {}).c,
                    }}
                  >
                    {selected.genre.name}
                  </span>
                  {selected.sub_genre ? (
                    <span
                      className="genre-tag"
                      style={{
                        color:
                          GENRE_STYLE[selected.sub_genre.code]?.c ?? "#888888",
                        borderColor:
                          GENRE_STYLE[selected.sub_genre.code]?.c ?? "#888888",
                      }}
                    >
                      {selected.sub_genre.name}
                    </span>
                  ) : null}
                </div>
              </div>

              <dl className="info-list">
                <div className="info-row">
                  <dt className="info-label">
                    <MapPin size={13} className="meta-icon" />
                    住所
                  </dt>
                  <dd className="info-value">
                    {selected.station_name}駅 ／ {selected.access}
                  </dd>
                </div>

                <div className="info-row">
                  <dt className="info-label">
                    <Clock size={13} className="meta-icon" />
                    営業時間
                  </dt>
                  <dd className="info-value">
                    {selected.open}（{selected.close}）
                  </dd>
                </div>

                <div className="info-row">
                  <dt className="info-label">
                    <Wallet size={13} className="meta-icon" />
                    予算目安
                  </dt>
                  <dd className="info-value">{selected.budget.name}</dd>
                </div>

                <div className="info-row">
                  <dt className="info-label">
                    <Users size={13} className="meta-icon" />
                    席数
                  </dt>
                  <dd className="info-value">{selected.capacity}席</dd>
                </div>
              </dl>
            </div>

            <div className="dialog-footer favorite-dialog-footer">
              <button
                type="button"
                className="ghost-btn favorite-remove-btn"
                onClick={() => handleRemoveFavorite()}
              >
                <HeartOff size={16} />
                お気に入り解除
              </button>
              <button
                type="button"
                className="reserve-btn"
                onClick={() => handleReserveButtonClick(selected.urls.pc)}
              >
                <CalendarCheck size={16} />
                予約する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* お気に入り削除の確認モーダル */}
      {confirmTarget && (
        <div className="confirm-overlay" onClick={cancelRemoveFavorite}>
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-body"
            tabIndex={-1}
            ref={confirmDialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap" aria-hidden="true">
              <AlertTriangle size={22} />
            </div>

            <h2 id="confirm-title" className="confirm-title">
              お気に入りを解除しますか？
            </h2>
            <p id="confirm-body" className="confirm-body">
              「{confirmTarget.name}」をお気に入りから削除します。
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={cancelRemoveFavorite}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="confirm-danger-btn"
                onClick={() => confirmRemoveFavorite(confirmTarget)}
              >
                <HeartOff size={16} />
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination
        page={currentPage}
        totalRestaurants={paginateTotalPage}
        handlePaginatePrevious={handlePaginatePrevious}
        handlePaginateNext={handlePaginateNext}
        handlePaginateButtonClick={handlePaginateButtonClick}
      />
    </div>
  );
}

/**
 * 指定した offset からお気に入り一覧を取得し、
 * レストラン詳細まで解決した配列を返す共通処理。
 * 取得に失敗した場合は toast でエラーを表示し null を返す。
 */
const fetchFavoritesPage = async (
  offset: number,
): Promise<RestaurantType[] | null> => {
  const params = new URLSearchParams({
    limit: String(LIMIT),
    offset: String(offset),
  });

  try {
    const res = await fetch(`/api/restaurants/favorites?${params.toString()}`, {
      method: "GET",
      credentials: "include",
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
      return null;
    }

    const favoriteRestaurants: FavoriteItem[] = data.favoriteRestaurants;
    const restaurants = await Promise.all(
      favoriteRestaurants.map(async ({ restaurant_id, created_at }) => {
        const detailParams = new URLSearchParams({ restaurant_id });
        const detailRes = await fetch(
          `/api/restaurants?${detailParams.toString()}`,
          { method: "GET", signal: AbortSignal.timeout(10000) },
        );
        const detailData = await detailRes.json();

        if (!detailRes.ok) {
          return null;
        }

        return {
          ...detailData.restaurants[0],
          created_at,
        };
      }),
    );

    // 個別リクエストが失敗すると null が混ざるためフィルタしておく
    return restaurants.filter((r): r is RestaurantType => r !== null);
  } catch (e: unknown) {
    if (e instanceof TypeError) {
      console.error("ネットワークエラーが発生しました:", e.message);
      // ユーザーへの通知: "インターネットに接続されていません。回線状況を確認してください。"
      toast.error(
        "インターネットに接続されていません。回線状況を確認してください。",
      );
      return null;
    }

    console.error("予期せぬエラー", e);
    toast.error(
      "予期せぬエラーが発生しました。時間を押してから再度実行してください",
    );
    return null;
  }
};
