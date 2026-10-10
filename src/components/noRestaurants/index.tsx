export const NoRestaurants = () => {
  return (
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

          <circle cx="60" cy="18" r="5" stroke="#a48c7a" strokeWidth="2.5" />

          {/* Top frame */}
          <rect fill="#564334" height="5" rx="2.5" width="48" x="36" y="38" />

          {/* Lantern body */}
          <ellipse cx="60" cy="66" fill="#201f1f" rx="28" ry="25" />

          <circle cx="60" cy="66" fill="#ffb77d" fillOpacity="0.18" r="16" />

          <circle cx="60" cy="66" fill="#ff8c00" fillOpacity="0.25" r="7" />

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
          <rect fill="#564334" height="5" rx="2.5" width="44" x="38" y="89" />

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
    </section>
  );
};
