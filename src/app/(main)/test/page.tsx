"use client";

import { useState } from "react";

export default function SearchEmptyPage() {
  const [isCleared, setIsCleared] = useState(false);

  const handleClearAll = () => {
    setIsCleared(true);

    setTimeout(() => {
      setIsCleared(false);
    }, 250);
  };

  const handleBroadenSearch = (label: string) => {
    console.log(`再検索: ${label}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="h-16 px-container-margin flex items-center justify-between gap-xs">
          <div className="flex items-center gap-xs">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(255,140,0,0.3)]">
              <span className="material-symbols-outlined text-[24px]">
                local_fire_department
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-label-bold text-label-bold text-primary tracking-wide">
                AMBER LANTERN
              </span>

              <span className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                Search
              </span>
            </div>
          </div>

          <div className="flex items-center gap-xs">
            <button
              type="button"
              className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"
              aria-label="通知"
            >
              <span className="material-symbols-outlined text-[24px]">
                notifications
              </span>
            </button>

            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-col relative w-full pt-16 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full pb-10">
          {/* Current Filters */}
          <section className="w-full px-container-margin pt-sm pb-base">
            <div className="bg-surface-container-high rounded-2xl p-sm shadow-md flex flex-col gap-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    filter_alt
                  </span>

                  <span className="font-label-sm text-label-sm tracking-wider uppercase">
                    現在の絞り込み条件
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className={`font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors flex items-center gap-base active:scale-95 ${
                    isCleared ? "opacity-50" : ""
                  }`}
                >
                  <span>条件クリア</span>

                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap items-center gap-xs pt-base">
                <FilterTag
                  icon="location_on"
                  iconColor="text-primary"
                  label="恵比寿"
                />

                <FilterTag
                  icon="sports_bar"
                  iconColor="text-secondary"
                  label="クラフトビール"
                />

                <FilterTag
                  icon="meeting_room"
                  iconColor="text-secondary"
                  label="個室あり"
                />

                <FilterTag icon="groups" iconColor="text-primary" label="8名" />
              </div>
            </div>
          </section>

          {/* Empty State */}
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
                <circle cx="86" cy="40" fill="#ffb77d" opacity="0.6" r="1.5" />

                <circle cx="94" cy="30" fill="#ff8c00" opacity="0.4" r="2.5" />

                <circle cx="28" cy="45" fill="#ffddb6" opacity="0.5" r="1" />
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

            {/* Broaden Criteria */}
            <div className="w-full flex flex-col items-center gap-xs">
              <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm mb-base">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  tips_and_updates
                </span>

                <span>条件を広げて探してみませんか？</span>
              </div>

              <div className="flex flex-wrap justify-center gap-xs w-full">
                <BroadenChip
                  icon="autorenew"
                  label="「恵比寿」のみで再検索"
                  onClick={() => handleBroadenSearch("恵比寿")}
                />

                <BroadenChip
                  icon="close_fullscreen"
                  label="「個室」条件を外す"
                  onClick={() => handleBroadenSearch("個室条件を削除")}
                  secondary
                />

                <BroadenChip
                  icon="directions_walk"
                  label="徒歩10分圏内も含める"
                  onClick={() => handleBroadenSearch("徒歩10分圏内")}
                  primaryFixed
                />
              </div>
            </div>

            {/* Modify Filter */}
            <div className="w-full mt-md">
              <button
                type="button"
                className="w-full py-3.5 px-md bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-label-bold text-label-bold rounded-2xl shadow-lg flex items-center justify-center gap-xs transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">
                  tune
                </span>

                <span>検索条件を変更する</span>
              </button>
            </div>
          </section>

          {/* AI Concierge */}
          <section className="w-full px-container-margin pb-lg">
            <div className="relative overflow-hidden rounded-3xl bg-surface-container-low shadow-xl p-md">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />

              <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-secondary-container/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-sm">
                <div className="flex items-center gap-xs">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      smart_toy
                    </span>
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="font-label-bold text-label-bold text-primary tracking-wide">
                      AI コンシェルジュに丸投げ
                    </span>

                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      幹事のこだわりを汲み取ります
                    </span>
                  </div>
                </div>

                <p className="font-body-md text-body-md text-on-surface text-left leading-snug">
                  「恵比寿でクラフトビール・8名・少しゆったり座れる席」の条件をそのまま伝えて、最適なプランをAIに組んでもらいませんか？
                </p>

                <div className="bg-surface-container-highest/60 rounded-2xl p-sm flex flex-col gap-xs text-left">
                  <div className="flex items-center gap-base text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      chat_bubble
                    </span>

                    <span>こんなリクエストが人気です：</span>
                  </div>

                  <div className="text-on-surface font-label-sm text-label-sm pl-sm">
                    ・「8名入れる近隣のクラフトビアバー＋個室居酒屋ハシゴ案」
                    <br />
                    ・「代官山寄りまで広げて、クラフトビール充実の穴場店」
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 px-sm bg-surface-bright hover:bg-surface-container-highest text-primary font-label-bold text-label-bold rounded-xl flex items-center justify-between transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">
                      forum
                    </span>

                    <span>AIコンシェルジュに対話で相談する</span>
                  </span>

                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Popular Restaurants */}
          <section className="w-full flex flex-col gap-sm">
            <div className="px-container-margin flex items-center justify-between">
              <div className="flex items-center gap-xs">
                <span className="w-2 h-5 rounded-full bg-primary" />

                <h2 className="font-headline-md text-headline-md text-on-surface">
                  恵比寿エリアの厳選人気店
                </h2>
              </div>

              <a
                className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:underline"
                href="#"
              >
                すべて見る
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </a>
            </div>

            {/* Restaurant Cards */}
            <div className="w-full overflow-x-auto px-container-margin pb-base flex gap-sm no-scrollbar">
              <RestaurantCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ_SIkBLTwZMSZUB0urrY7yaf4SYuHtmzrtGT0RLyqtyrGt2jGFBIgpsYIBK3XhqdiefFxr-Ks49lQdl3ZHJ3CEQBYGED-uvWZaff1YCDzBAjFXsMTaDYHV4Ygau2J4MPBnAyG9jT4m-ocSOGoP2uhRgfYwN8riXRFUCLQXPwKx8FN7fR_hEJOastCPxORPT0T0v5vn0QWhy-b_TAlvfNPiPDtlKJOw4KcwpX2HPrGat2YAL9YFRpftw"
                badge="恵比寿駅 徒歩2分"
                rating="4.8"
                reviews="142件"
                seat="カウンター・半個室"
                name="炭火焼鳥 暁 (あかつき)"
                description="希少銘柄鶏と厳選クラフト日本酒が自慢の路地裏酒場"
                price="¥4,000〜¥5,500"
              />

              <RestaurantCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuD0Ldpc-bIGqygHhDuLRgp8OMEbnwmNsYajBpPMR21JxB0yfXsbdXigb1sV0updYIvHeOY-MCRtG0yCtCEtmlfW9AklCvmBzcdUkOTnERI4WjmyXCrv6okZs4HXn9S-6Jm4SSQJbxVV0OFpivBPj7XxSmZHrtO9sWFLzxokEdQBoFoP6Gb3sHkkpezUx8p0khWaepVe-d_CVD6jlrrK0J3lA5sFPU4Cqzwm4ibxEyaLQcEUO_wfbAAHEQ"
                badge="恵比寿西口 徒歩4分"
                rating="4.6"
                reviews="98件"
                seat="掘りごたつ個室"
                name="海鮮酒場 凪 (なぎ)"
                description="毎朝豊洲直送の鮮魚盛合せと季節の限定樽生ビール"
                price="¥5,000〜¥6,500"
              />

              <RestaurantCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDZYUT22V5IhlyBjPKlLh1Bzn0zaYBomVq8cNGv4QfzC0ktfXAkDBWnu3pYvu_visn8Vs0BSiI3lWbHTS_FDMQ7mT2Hp_QvU4A6q1kXfPLKGIkc5_JvSRmLH-R0bwOPAs5UZw3rc7y20Fo2uwj4ENSUQTqWmJK6LUroxEbth1NAuqzzpVwDkdFftC4BhBF7xiKcOY5sm91sM2M3waj_ruPNutWOCqfpiBMmeNRzdzEetqvwsuLJurHtFQ"
                badge="クラフトタップ24種"
                rating="4.7"
                reviews="210件"
                seat="貸切・ソファー席"
                name="EBISU CRAFT STAND"
                description="国内厳選醸造所から届くクラフト生と燻製料理"
                price="¥3,500〜¥5,000"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex justify-around items-center h-16 px-xs">
          <NavItem icon="search" label="Search" active />
          <NavItem icon="smart_toy" label="Concierge" />
          <NavItem icon="bookmark" label="Favorites" />
          <NavItem icon="account_circle" label="Profile" />
        </div>
      </nav>
    </div>
  );
}

type FilterTagProps = {
  icon: string;
  iconColor: string;
  label: string;
};

function FilterTag({ icon, iconColor, label }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-base px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm shadow-sm">
      <span className={`material-symbols-outlined text-[14px] ${iconColor}`}>
        {icon}
      </span>

      {label}

      <button
        type="button"
        aria-label={`${label}を削除`}
        className="text-on-surface-variant hover:text-on-surface ml-base leading-none"
      >
        ×
      </button>
    </span>
  );
}

type BroadenChipProps = {
  icon: string;
  label: string;
  onClick: () => void;
  secondary?: boolean;
  primaryFixed?: boolean;
};

function BroadenChip({
  icon,
  label,
  onClick,
  secondary,
  primaryFixed,
}: BroadenChipProps) {
  let iconColor = "text-primary";

  if (secondary) {
    iconColor = "text-secondary";
  }

  if (primaryFixed) {
    iconColor = "text-primary-fixed-dim";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-base px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-on-surface font-label-sm text-label-sm active:scale-95 shadow-sm"
    >
      <span
        className={`material-symbols-outlined text-[16px] ${iconColor} group-hover:scale-110 transition-transform`}
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

type RestaurantCardProps = {
  image: string;
  badge: string;
  rating: string;
  reviews: string;
  seat: string;
  name: string;
  description: string;
  price: string;
};

function RestaurantCard({
  image,
  badge,
  rating,
  reviews,
  seat,
  name,
  description,
  price,
}: RestaurantCardProps) {
  return (
    <article className="flex-shrink-0 w-64 bg-surface-container rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="relative w-full h-36">
        <img className="w-full h-full object-cover" src={image} alt={name} />

        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-black/30" />

        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-sm text-label-sm font-bold">
          {badge}
        </span>

        <button
          type="button"
          aria-label="お気に入り追加"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/70 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            bookmark_add
          </span>
        </button>
      </div>

      <div className="p-sm flex flex-col gap-base flex-grow justify-between">
        <div>
          <div className="flex items-center gap-base mb-base">
            <span
              className="material-symbols-outlined text-[16px] text-primary"
              style={{
                fontVariationSettings: "'FILL' 1",
              }}
            >
              star
            </span>

            <span className="font-label-bold text-label-bold text-on-surface">
              {rating}
            </span>

            <span className="font-label-sm text-label-sm text-on-surface-variant">
              ({reviews})
            </span>

            <span className="ml-auto font-label-sm text-label-sm text-secondary">
              {seat}
            </span>
          </div>

          <h3 className="font-headline-md text-[18px] text-on-surface font-bold line-clamp-1">
            {name}
          </h3>

          <p className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-base">
            {description}
          </p>
        </div>

        <div className="pt-xs flex items-center justify-between">
          <span className="font-label-bold text-label-bold text-primary">
            {price}
          </span>

          <button
            type="button"
            className="px-3 py-1 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-sm text-label-sm rounded-lg transition-colors"
          >
            詳細
          </button>
        </div>
      </div>
    </article>
  );
}

type NavItemProps = {
  icon: string;
  label: string;
  active?: boolean;
};

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <a
      href="#"
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-base transition-all duration-200 active:scale-95 ${
        active ? "text-primary font-bold" : "text-on-surface-variant"
      }`}
    >
      <span className="material-symbols-outlined text-[24px]">{icon}</span>

      <span className="font-label-sm text-label-sm">{label}</span>
    </a>
  );
}
