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
import { GENRE_STYLE, RestaurantType } from "@/types/restaurant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SortKey = "recent" | "name";
type FavoriteFromProps = {
  data: RestaurantType[];
};

export default function FavoriteForm(data: FavoriteFromProps) {
  const router = useRouter();
  const favorites = data.data;

  const [selectedId, setSelectedId] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirmTarget, setConfirmTarget] = useState<RestaurantType | null>(
    null,
  ); // 削除確認ダイアログ
  const confirmDialogRef = useRef<HTMLDivElement>(null);

  const selected = favorites.find((s) => s.id === selectedId) || null;

  useEffect(() => {
    if (selected && dialogRef.current) dialogRef.current.focus();
  }, [selected]);

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
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message); // 店名込みで表示させた方が良い？
      setConfirmTarget(null); // モーダル閉じる
      setSelectedId(""); // 詳細モーダルを閉じる

      router.refresh(); // サーバーへ最新データを取得するリクエストを送り更新する
    } catch (e: unknown) {
      console.error("e", e);
    }
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
          <span>{favorites.length}件 保存中</span>
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

        {favorites.map((shop) => {
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

              {/* <button
                type="button"
                className="favorite-heart-btn"
                onClick={() => handleRemoveFavorite(shop)}
                aria-label={`${shop.name}をお気に入りから削除`}
              >
                <Heart size={18} fill="#E2532B" />
              </button> */}
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
              <button type="button" className="reserve-btn">
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
    </div>
  );
}
