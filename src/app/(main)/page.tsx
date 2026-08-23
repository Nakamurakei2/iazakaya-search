"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Search,
  MapPin,
  X,
  Clock,
  Users,
  Wallet,
  CalendarCheck,
  Loader2,
  Flame,
  MapPinned,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Pagination } from "@/components/pagination";
import {
  handleLocationSearch,
  handlePaginateButtonClick,
  handlePaginateNext,
  handlePaginatePrevious,
  handleReserve,
  handleSearch,
} from "@/services/restaurant-api";
import { GENRE_STYLE, Location, ShopsType } from "@/types/restaurant";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// モックデータ
// ---------------------------------------------------------------------------
const pageSize_OPTIONS = [5, 10, 20, 30] as const;

const RESERVE_URL_BASE = "https://reserve.yokocho-navi.jp/shop";

// ---------------------------------------------------------------------------
// ジャンルマスタ（表示用のUIモック）
// ※ コード・名称は @/types/restaurant 側の定義に合わせて調整してください
// ---------------------------------------------------------------------------
const GENRE_OPTIONS = [
  { code: "G001", name: "居酒屋" },
  { code: "G002", name: "ダイニングバー・バル" },
  { code: "G003", name: "創作料理" },
  { code: "G004", name: "和食" },
  { code: "G008", name: "焼肉・ホルモン" },
  { code: "G013", name: "ラーメン" },
  { code: "G012", name: "バー・カクテル" },
  { code: "G016", name: "お好み焼き・もんじゃ" },
] as const;

const IZAKAYA_GENRE_CODE = "G001";

export default function IzakayaSearchApp() {
  const router = useRouter();
  const [stationName, setStationName] = useState<string>("");
  const [shops, setShops] = useState<ShopsType[]>(); // 表示用レストランデータ(距離含む)
  const [page, setPage] = useState<number>(1); // ページネーション用の現在どのページを表す
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false); // 読み込み中を表す
  const [locationNotice, setLocationNotice] = useState<string>(""); // 距離についての文言
  const dialogRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalRestaurants, setTotalRestaurants] = useState<number>(0); // 該当したレストラン総数
  const [pageSize, setPageSize] = useState(20); // 取得件数
  const [startPage, setStartPage] = useState(1); // 検索の開始位置
  const [currentLocationData, setCurrentLocationData] =
    useState<Location | null>(null); // 現在地格納

  // --- 詳細検索（ジャンル絞り込み）: UIのみ。検索処理との連携は未実装 ---
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = shops?.find((s) => s.id === selectedId) || null;

  useEffect(() => {
    setPage(1);
  }, [stationName]);

  useEffect(() => {
    if (page > totalRestaurants) setPage(totalRestaurants);
  }, [totalRestaurants, page]);

  useEffect(() => {
    if (selected && dialogRef.current) dialogRef.current.focus();
  }, [selected]);

  const toggleGenre = (code: string) => {
    setSelectedGenres((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const removeGenre = (code: string) => {
    setSelectedGenres((prev) => prev.filter((c) => c !== code));
  };

  const handleClearGenres = () => {
    setSelectedGenres([]);
  };

  // TODO: 「この条件で検索」押下時に selectedGenres を使って実際の検索処理と連携する
  const handleApplyAdvancedSearch = () => {
    setIsAdvancedOpen(false);
  };

  // TODO: 「居酒屋のみで絞り込む」押下時に selectedGenres を使って実際の検索処理と連携する
  const handleQuickIzakayaFilter = () => {
    setSelectedGenres([IZAKAYA_GENRE_CODE]);
  };

  /**
   * Enterキー押下時処理
   * @param e フォームイベント
   */
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    handleSearch({
      pageSize,
      startPage,
      stationName,
      setIsLocating,
      setTotalRestaurants,
      setShops,
      setPage,
      setLocationNotice,
      setCurrentLocationData,
    });
  };

  return (
    <>
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}
      <div className="page">
        <div className="ambient-glow" aria-hidden="true" />
        {/* ヘッダー */}
        <header className="header">
          <div className="brand-row">
            <span className="lantern-dot" aria-hidden="true" />
            <h1 className="brand-title">夜のよこ町</h1>
          </div>
          <p className="brand-sub">今夜の一軒を、近くから探す</p>
        </header>
        {/* 検索エリア */}
        <section className="search-card" ref={scrollRef}>
          <form className="search-row" onSubmit={(e) => handleSubmit(e)}>
            <div className="input-wrap">
              <Search
                size={18}
                color="#B3A594"
                className="input-icon"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleSearch({
                    pageSize,
                    startPage,
                    stationName,
                    setIsLocating,
                    setTotalRestaurants,
                    setShops,
                    setPage,
                    setLocationNotice,
                    setCurrentLocationData,
                  });
                }}
              />
              <input
                type="text"
                name="stationSearch"
                autoComplete="search-term"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="駅名で検索（例：渋谷）"
                className="input"
                aria-label="駅名や店名で検索"
                enterKeyHint="search" // スマホのキーボードのEnterを「検索」に変更する
              />
              {/* 隠し送信ボタン：これでスマホやPCのEnterを確実にキャッチ */}
              <button
                type="submit"
                style={{ display: "none" }}
                aria-hidden="true"
              />

              {/* TODO：ジャンル検索するために何かボタンなどを別途用意する */}
              {stationName && (
                <button
                  onClick={() => setStationName("")}
                  className="clear-btn"
                  aria-label="検索文字をクリア"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setStartPage(1);

                handleLocationSearch({
                  pageSize,
                  setStartPage,
                  setIsLocating,
                  setLocationNotice,
                  setCurrentLocationData,
                  setTotalRestaurants,
                  setShops,
                  setStationName,
                  setPage,
                });
              }}
              className="location-btn"
              disabled={isLocating}
            >
              {isLocating ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <MapPin size={16} />
              )}

              <span>{isLocating ? "現在地を取得中…" : "現在地から検索"}</span>
            </button>
          </form>

          {/* 詳細検索トグル + 居酒屋クイックフィルタ（UIのみ） */}
          <div className="advanced-toggle-row">
            <button
              type="button"
              className="advanced-toggle-btn"
              onClick={() => setIsAdvancedOpen((v) => !v)}
              aria-expanded={isAdvancedOpen}
            >
              <SlidersHorizontal size={14} />
              詳細検索
              <ChevronDown
                size={14}
                className={`advanced-toggle-caret ${
                  isAdvancedOpen ? "advanced-toggle-caret--open" : ""
                }`}
              />
            </button>

            <button
              type="button"
              className="quick-filter-btn"
              onClick={handleQuickIzakayaFilter}
            >
              居酒屋のみで絞り込む
            </button>
          </div>

          {/* 詳細検索パネル（ジャンル絞り込み・UIのみ） */}
          {isAdvancedOpen && (
            <div className="advanced-panel">
              <p className="advanced-panel-label">ジャンルで絞り込む</p>
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
                  この条件で検索
                </button>
              </div>
            </div>
          )}

          {locationNotice && (
            <p className="location-notice">
              <MapPinned size={13} className="location-notice-icon" />
              {locationNotice}から近い順に表示しています
            </p>
          )}
        </section>

        {/* 適用中のジャンルフィルタ（UIのみ） */}
        {selectedGenres.length > 0 && (
          <div className="applied-filters-row">
            {selectedGenres.map((code) => {
              const g = GENRE_OPTIONS.find((o) => o.code === code);
              if (!g) return null;
              const color =
                GENRE_STYLE[code as keyof typeof GENRE_STYLE]?.c ?? "#8C6A4E";
              return (
                <span
                  key={code}
                  className="applied-filter-chip"
                  style={{ borderColor: color, color }}
                >
                  {g.name}
                  <button
                    type="button"
                    onClick={() => removeGenre(code)}
                    aria-label={`${g.name}を解除`}
                  >
                    <X size={11} />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="display-row baseline">
          {/* 結果件数 */}
          <div className="result-meta">
            <span>
              {totalRestaurants ? totalRestaurants : 0}件 見つかりました
            </span>
          </div>

          <div className="display-column">
            {/* 検索数 */}
            <select
              id="page-size-select"
              className="page-size-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {pageSize_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}件表示
                </option>
              ))}
            </select>
            {totalRestaurants && totalRestaurants > 1 && (
              <span
                className="page-indicator-small result-meta"
                style={{ marginTop: "10px" }}
              >
                {page} / {Math.ceil(totalRestaurants / pageSize)} ページ
              </span>
            )}
          </div>
        </div>

        {/* 一覧 */}
        <main className="list">
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
              <button
                key={shop.id}
                className="card"
                onClick={() => setSelectedId(shop.id)}
                aria-haspopup="dialog"
              >
                <div
                  className="card-stripe"
                  style={{ background: style.c }}
                  aria-hidden="true"
                />

                <div className="card-body">
                  <div className="card-top-row">
                    <h2 className="card-name">{shop.name}</h2>

                    <span
                      className="genre-tag"
                      style={{
                        color: style.c,
                        borderColor: style.c,
                      }}
                    >
                      {shop.genre.name}
                    </span>
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

                  <div className="tag-row">
                    {/* {shop.tags.slice(0, 3).map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))} */}

                    {locationNotice && (
                      <span className="distance-chip">
                        {locationNotice}{" "}
                        {shop.distanceKm < 1
                          ? `${Math.round(shop.distanceKm * 1000)}m`
                          : `${shop.distanceKm.toFixed(2)}km`}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </main>
        {/* ページネーション */}
        {Math.ceil(totalRestaurants / pageSize) > 1 && (
          <Pagination
            page={page}
            totalRestaurants={Math.ceil(totalRestaurants / pageSize)}
            handlePaginatePrevious={() =>
              handlePaginatePrevious({
                page,
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
              })
            }
          />
        )}

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

                  <span
                    className="genre-tag"
                    style={{
                      color: GENRE_STYLE[selected.genre.code]?.c ?? "#888888",
                      borderColor:
                        GENRE_STYLE[selected.genre.code]?.c ?? "#888888",
                    }}
                  >
                    {selected.genre.name}
                  </span>
                </div>

                <div className="rating-row">
                  <span className="rating-count">
                    {/* （{selected.reviews}件のレビュー） */}
                  </span>
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

                    <dd className="info-value">{selected.name}</dd>
                  </div>

                  <div className="info-row">
                    <dt className="info-label">
                      <Users size={13} className="meta-icon" />
                      席数
                    </dt>

                    <dd className="info-value">{selected.capacity}席</dd>
                  </div>
                </dl>

                {/* <div className="tag-row">
                  {selected.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div> */}
              </div>

              <div className="dialog-footer">
                <button
                  className="reserve-btn"
                  onClick={() => handleReserve(selected)}
                >
                  <CalendarCheck size={16} />
                  予約する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
