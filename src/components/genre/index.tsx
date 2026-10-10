import { GENRE_OPTIONS, GENRE_STYLE } from "@/types/restaurant";
import { Tags } from "lucide-react";
import { SetStateAction } from "react";

type Props = {
  isAdvancedOpen: boolean;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<SetStateAction<string[]>>;
  setIsAdvancedOpen: React.Dispatch<SetStateAction<boolean>>;
};

export const GenreSearch = (props: Props) => {
  const {
    isAdvancedOpen,
    selectedGenres,
    setSelectedGenres,
    setIsAdvancedOpen,
  } = props;

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

  return (
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
                GENRE_STYLE[g.code as keyof typeof GENRE_STYLE]?.c ?? "#8C6A4E";
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
  );
};
