"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  X,
  Star,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Wallet,
  CalendarCheck,
  Loader2,
  Flame,
  MapPinned,
} from "lucide-react";
import { Header } from "@/components/header/header";

// ---------------------------------------------------------------------------
// モックデータ
// ---------------------------------------------------------------------------
const GENRE_STYLE = {
  焼き鳥: { c: "#E2532B" },
  海鮮居酒屋: { c: "#3E8EA8" },
  もつ焼き: { c: "#B4472E" },
  立ち飲み: { c: "#C98A2C" },
  創作居酒屋: { c: "#7A5FB0" },
  日本酒バー: { c: "#5C7A4A" },
  餃子酒場: { c: "#D9A441" },
  おでん: { c: "#8C6A4E" },
  ホルモン: { c: "#A83232" },
};

const RAW_SHOPS = [
  {
    id: 1,
    name: "炭火焼鳥 鳥源",
    station: "渋谷",
    genre: "焼き鳥",
    rating: 4.3,
    reviews: 218,
    budget: "¥3,000〜¥4,000",
    seats: 32,
    hours: "17:00〜24:00",
    holiday: "日曜定休",
    address: "東京都渋谷区道玄坂2-1",
    tags: ["個室あり", "飲み放題", "喫煙可"],
    distanceKm: 0.4,
  },
  {
    id: 2,
    name: "海鮮酒場 波音",
    station: "恵比寿",
    genre: "海鮮居酒屋",
    rating: 4.5,
    reviews: 342,
    budget: "¥4,000〜¥5,000",
    seats: 40,
    hours: "16:00〜23:30",
    holiday: "無休",
    address: "東京都渋谷区恵比寿1-8",
    tags: ["個室あり", "貸切可", "日本酒豊富"],
    distanceKm: 1.2,
  },
  {
    id: 3,
    name: "もつ焼き 大将",
    station: "中目黒",
    genre: "もつ焼き",
    rating: 4.1,
    reviews: 156,
    budget: "¥2,500〜¥3,500",
    seats: 18,
    hours: "17:30〜23:00",
    holiday: "月曜定休",
    address: "東京都目黒区上目黒2-3",
    tags: ["カウンター", "一人飲み歓迎"],
    distanceKm: 2.1,
  },
  {
    id: 4,
    name: "立ち呑み 一献",
    station: "新宿三丁目",
    genre: "立ち飲み",
    rating: 3.9,
    reviews: 98,
    budget: "〜¥2,000",
    seats: 14,
    hours: "15:00〜23:00",
    holiday: "無休",
    address: "東京都新宿区新宿3-10",
    tags: ["安い", "早飲み"],
    distanceKm: 0.8,
  },
  {
    id: 5,
    name: "創作居酒屋 灯",
    station: "神楽坂",
    genre: "創作居酒屋",
    rating: 4.6,
    reviews: 271,
    budget: "¥5,000〜¥6,000",
    seats: 24,
    hours: "18:00〜24:00",
    holiday: "水曜定休",
    address: "東京都新宿区神楽坂3-6",
    tags: ["デート向き", "個室あり", "コース有"],
    distanceKm: 3.5,
  },
  {
    id: 6,
    name: "日本酒バー 蔵人",
    station: "五反田",
    genre: "日本酒バー",
    rating: 4.4,
    reviews: 133,
    budget: "¥3,500〜¥4,500",
    seats: 16,
    hours: "18:00〜25:00",
    holiday: "日曜定休",
    address: "東京都品川区西五反田1-4",
    tags: ["日本酒豊富", "少人数向け"],
    distanceKm: 4.0,
  },
  {
    id: 7,
    name: "餃子酒場 龍餃",
    station: "池袋",
    genre: "餃子酒場",
    rating: 4.0,
    reviews: 187,
    budget: "¥2,800〜¥3,800",
    seats: 45,
    hours: "17:00〜23:30",
    holiday: "無休",
    address: "東京都豊島区西池袋1-2",
    tags: ["大人数OK", "宴会向き"],
    distanceKm: 1.9,
  },
  {
    id: 8,
    name: "おでん 湯気",
    station: "三軒茶屋",
    genre: "おでん",
    rating: 4.2,
    reviews: 145,
    budget: "¥3,000〜¥4,000",
    seats: 20,
    hours: "17:00〜23:00",
    holiday: "火曜定休",
    address: "東京都世田谷区三軒茶屋2-1",
    tags: ["カウンター", "老舗"],
    distanceKm: 2.8,
  },
  {
    id: 9,
    name: "ホルモン一代",
    station: "高円寺",
    genre: "ホルモン",
    rating: 4.3,
    reviews: 202,
    budget: "¥3,000〜¥4,000",
    seats: 28,
    hours: "17:00〜24:00",
    holiday: "無休",
    address: "東京都杉並区高円寺北2-3",
    tags: ["飲み放題", "深夜営業"],
    distanceKm: 3.2,
  },
  {
    id: 10,
    name: "焼き鳥 一羽",
    station: "赤坂見附",
    genre: "焼き鳥",
    rating: 4.5,
    reviews: 264,
    budget: "¥4,500〜¥5,500",
    seats: 22,
    hours: "17:30〜23:00",
    holiday: "日曜定休",
    address: "東京都港区赤坂3-11",
    tags: ["接待利用", "個室あり"],
    distanceKm: 5.1,
  },
  {
    id: 11,
    name: "立ち飲み処 三吉",
    station: "神田",
    genre: "立ち飲み",
    rating: 3.8,
    reviews: 76,
    budget: "〜¥2,500",
    seats: 12,
    hours: "16:00〜22:30",
    holiday: "土日定休",
    address: "東京都千代田区神田司町2-1",
    tags: ["安い", "サラリーマン御用達"],
    distanceKm: 4.6,
  },
  {
    id: 12,
    name: "海鮮 浅草丸",
    station: "浅草",
    genre: "海鮮居酒屋",
    rating: 4.4,
    reviews: 189,
    budget: "¥3,800〜¥4,800",
    seats: 36,
    hours: "16:30〜23:00",
    holiday: "無休",
    address: "東京都台東区浅草1-5",
    tags: ["観光客歓迎", "個室あり"],
    distanceKm: 6.3,
  },
  {
    id: 13,
    name: "創作和食 縁側",
    station: "吉祥寺",
    genre: "創作居酒屋",
    rating: 4.7,
    reviews: 310,
    budget: "¥4,500〜¥5,500",
    seats: 20,
    hours: "17:00〜23:30",
    holiday: "月曜定休",
    address: "東京都武蔵野市吉祥寺本町1-9",
    tags: ["デート向き", "個室あり"],
    distanceKm: 7.0,
  },
];

const PAGE_SIZE = 5;
const RESERVE_URL_BASE = "https://reserve.yokocho-navi.jp/shop";

export default function IzakayaSearchApp() {
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState(RAW_SHOPS);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState(null);
  const [toast, setToast] = useState(null);
  const dialogRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return shops;
    return shops.filter(
      (s) => s.name.includes(q) || s.station.includes(q) || s.genre.includes(q),
    );
  }, [query, shops]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedShops = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = shops.find((s) => s.id === selectedId) || null;

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (selected && dialogRef.current) dialogRef.current.focus();
  }, [selected]);

  const handleLocationSearch = () => {
    setIsLocating(true);
    setLocationNotice(null);
    // 実際のアプリでは navigator.geolocation.getCurrentPosition() を利用して
    // 現在地の緯度経度を取得し、距離順に並び替える。
    setTimeout(() => {
      const sorted = [...shops].sort((a, b) => a.distanceKm - b.distanceKm);
      setShops(sorted);
      setQuery("");
      setPage(1);
      setIsLocating(false);
      setLocationNotice("現在地から近い順に表示しています");
    }, 900);
  };

  const handleReserve = (shop) => {
    // 予約ボタン押下時、外部の予約ページへ遷移する
    const url = `${RESERVE_URL_BASE}/${shop.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setToast(`「${shop.name}」の予約ページへ移動します`);
  };

  return (
    <>
      {/* <Header /> */}
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
        <section className="search-card">
          <div className="search-row">
            <div className="input-wrap">
              <Search size={18} color="#B3A594" className="input-icon" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="駅名・店名・ジャンルで検索（例：渋谷、焼き鳥）"
                className="input"
                aria-label="駅名や店名で検索"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="clear-btn"
                  aria-label="検索文字をクリア"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={handleLocationSearch}
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
          </div>

          {locationNotice && (
            <p className="location-notice">
              <MapPinned size={13} className="location-notice-icon" />
              {locationNotice}
            </p>
          )}
        </section>

        {/* 結果件数 */}
        <div className="result-meta">
          <span>{filtered.length}件 見つかりました</span>

          {totalPages > 1 && (
            <span className="page-indicator-small">
              {page} / {totalPages} ページ
            </span>
          )}
        </div>

        {/* 一覧 */}
        <main className="list">
          {pagedShops.length === 0 && (
            <div className="empty-state">
              <p className="empty-title">該当するお店が見つかりませんでした</p>

              <p className="empty-body">
                駅名や店名を変えて、もう一度お試しください。
              </p>
            </div>
          )}

          {pagedShops.map((shop) => {
            const style = GENRE_STYLE[shop.genre] || { c: "#8C6A4E" };

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
                      {shop.genre}
                    </span>
                  </div>

                  <div className="card-meta-row">
                    <span className="meta-item">
                      <MapPin size={12} className="meta-icon" />
                      {shop.station}駅
                    </span>

                    <span className="meta-item">
                      <Star
                        size={12}
                        className="meta-icon rating-icon"
                        fill="#D9A441"
                      />
                      {shop.rating}（{shop.reviews}）
                    </span>

                    <span className="meta-item">
                      <Wallet size={12} className="meta-icon" />
                      {shop.budget}
                    </span>
                  </div>

                  <div className="tag-row">
                    {shop.tags.slice(0, 3).map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}

                    {locationNotice && (
                      <span className="distance-chip">
                        現在地から {shop.distanceKm}km
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </main>

        {/* ページネーション */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="ページ送り">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="前のページ"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`page-num ${n === page ? "page-num-active" : ""}`}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="次のページ"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}

        {/* 詳細ダイアログ */}
        {selected && (
          <div className="overlay" onClick={() => setSelectedId(null)}>
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
                  onClick={() => setSelectedId(null)}
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
                      color: (GENRE_STYLE[selected.genre] || {}).c,
                      borderColor: (GENRE_STYLE[selected.genre] || {}).c,
                    }}
                  >
                    {selected.genre}
                  </span>
                </div>

                <div className="rating-row">
                  <Star size={15} className="rating-star" fill="#D9A441" />

                  <span className="rating-num">{selected.rating}</span>

                  <span className="rating-count">
                    （{selected.reviews}件のレビュー）
                  </span>
                </div>

                <dl className="info-list">
                  <div className="info-row">
                    <dt className="info-label">
                      <MapPin size={13} className="meta-icon" />
                      住所
                    </dt>

                    <dd className="info-value">
                      {selected.station}駅 ／ {selected.address}
                    </dd>
                  </div>

                  <div className="info-row">
                    <dt className="info-label">
                      <Clock size={13} className="meta-icon" />
                      営業時間
                    </dt>

                    <dd className="info-value">
                      {selected.hours}（{selected.holiday}）
                    </dd>
                  </div>

                  <div className="info-row">
                    <dt className="info-label">
                      <Wallet size={13} className="meta-icon" />
                      予算目安
                    </dt>

                    <dd className="info-value">{selected.budget}</dd>
                  </div>

                  <div className="info-row">
                    <dt className="info-label">
                      <Users size={13} className="meta-icon" />
                      席数
                    </dt>

                    <dd className="info-value">{selected.seats}席</dd>
                  </div>
                </dl>

                <div className="tag-row">
                  {selected.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
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

        {/* トースト */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
