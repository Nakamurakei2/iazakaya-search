import { Izakayas } from "@/types/restaurant";
import { IoIosCloseCircleOutline } from "react-icons/io";

type Props = {
  modalOpen?: boolean;
  title?: string;
  onClose?: () => void;
  izakaya: Izakayas | null;
  onAddToReservation?: (izakaya: Izakayas) => void;
};

function SectionLabel({ text }: { text: string }) {
  return <p className="modal-section-label">{text}</p>;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label?: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="modal-info-row">
      <i className={`ti ti-${icon} modal-info-icon`} aria-hidden="true" />
      <span className="modal-info-value">
        {label && <span className="modal-info-label">{label}</span>}
        {value}
      </span>
    </div>
  );
}

function FeatureTag({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  const isOn = value === "あり" || value === "1";
  if (!isOn && value !== "なし" && !value) return null; // 値が空なら表示しない
  return (
    <span className={`modal-feature-tag ${isOn ? "on" : "off"}`}>
      <i className={`ti ti-${icon} modal-feature-icon`} aria-hidden="true" />
      {label}
    </span>
  );
}

// ============================================================
// メインモーダル
// ============================================================

export const Modal = ({ modalOpen, title = "", onClose, izakaya }: Props) => {
  if (!modalOpen || !izakaya) return null;

  const izakayaUrl = izakaya.urls.pc;

  const photoL = izakaya.photo?.pc?.l;

  /** 設備フラグ一覧（icon / label / value） */
  const features: { icon: string; label: string; value?: string }[] = [
    { icon: "glass-full", label: "飲み放題", value: izakaya.free_drink },
    { icon: "tools-kitchen-2", label: "コースあり", value: izakaya.course },
    { icon: "bowl-chopsticks", label: "食べ放題", value: izakaya.free_food },
    { icon: "smoking-no", label: "禁煙席あり", value: izakaya.non_smoking },
    { icon: "building", label: "貸切可", value: izakaya.charter },
    { icon: "credit-card", label: "カード可", value: izakaya.card },
  ].filter((f) => f.value !== undefined);

  return (
    <div
      className={modalOpen ? "modal-overlay" : "modal-overlay hidden"}
      onClick={() => onClose?.()}
    >
      <div
        className="modal-container modal-container-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================ */}
        {/* ヘッダー：メイン写真 + 店名オーバーレイ            */}
        {/* ================================================ */}
        <div className="modal-hero">
          {photoL ? (
            <img
              src={photoL}
              alt={`${izakaya.name}の写真`}
              className="modal-hero-img"
            />
          ) : (
            <div className="modal-hero-placeholder">
              <i
                className="ti ti-photo-off modal-hero-placeholder-icon"
                aria-hidden="true"
              />
              <span className="modal-hero-placeholder-label">photo.pc.l</span>
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            className="modal-close-circle"
            onClick={() => onClose?.()}
            aria-label="閉じる"
          >
            <IoIosCloseCircleOutline className="close-button-icon" />
          </button>

          <div className="modal-hero-overlay">
            <div className="modal-genre-row">
              {izakaya.genre?.name && (
                <span className="modal-genre-badge">{izakaya.genre.name}</span>
              )}
            </div>
            <h3 className="modal-hero-title">{izakaya.name}</h3>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-stat-row">
            {[
              {
                label: "予算",
                main: izakaya.budget?.name ?? "−",
                sub: izakaya.budget?.average
                  ? `平均 ${izakaya.budget.average}`
                  : undefined,
              },
            ].map(({ label, main, sub }) => (
              <div key={label} className="modal-stat-card">
                <p className="modal-stat-label">{label}</p>
                <p className="modal-stat-main">{main}</p>
                {sub && <p className="modal-stat-sub">{sub}</p>}
              </div>
            ))}
          </div>

          {/* ── アクセス・住所 ── */}
          <div className="modal-section">
            <SectionLabel text="アクセス・住所" />
            <div>
              {izakaya.station_name && (
                <InfoRow
                  icon="train"
                  label="最寄り駅"
                  value={izakaya.station_name}
                />
              )}
              <InfoRow icon="walk" value={izakaya.access} />
              <InfoRow icon="map-pin" value={izakaya.address} />
              {izakaya.open && (
                <InfoRow icon="clock" label="営業時間" value={izakaya.open} />
              )}
              {izakaya.close && (
                <InfoRow
                  icon="calendar-off"
                  label="定休日"
                  value={izakaya.close}
                />
              )}
              {izakaya.tel && <InfoRow icon="phone" value={izakaya.tel} />}
            </div>
          </div>

          {/* ── 設備・サービス ── */}
          {features.length > 0 && (
            <div className="modal-section">
              <SectionLabel text="設備・サービス" />
              <div className="modal-feature-tags">
                {features.map((f) => (
                  <FeatureTag
                    key={f.label}
                    icon={f.icon}
                    label={f.label}
                    value={f.value}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="cation-text fsize-13">※APIからの情報は以上です。</p>
          <SectionLabel text="詳細な情報やネット予約は以下のリンクから" />
          <p className="url">
            <a
              href={izakayaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              {izakayaUrl}
            </a>
          </p>
          <p
            className="cation-text fsize-13"
            style={{ marginTop: "-15px", textAlign: "left" }}
          >
            Hot Pepperグルメページへ遷移します。
          </p>

          {/* ── アクションボタン ── */}
          {/* <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onAddToReservation?.(izakaya)}
              style={{
                flex: 2,
                padding: 11,
                borderRadius: "var(--border-radius-md)",
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                background: "#534AB7",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <i
                className="ti ti-calendar-plus"
                aria-hidden="true"
                style={{ fontSize: 14 }}
              />
              この店を予約候補に追加
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
