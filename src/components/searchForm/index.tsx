import { Search } from "lucide-react";
import { SetStateAction } from "react";
import { FaLocationArrow, FaSpinner } from "react-icons/fa";

type Props = {
  setStationName: React.Dispatch<SetStateAction<string>>;
  isRestaurantsDataFetching: boolean;
  handleSearch: () => void;
  handleLocationButtonClick: () => Promise<void>;
};

export const SearchForm = (props: Props) => {
  const {
    setStationName,
    isRestaurantsDataFetching,
    handleSearch,
    handleLocationButtonClick,
  } = props;

  return (
    <section className="col-span-4 md:col-span-8 md:col-start-3 flex flex-col gap-sm mb-lg">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background text-center mb-xs">
        今夜のお店を探す
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
            onClick={() => handleSearch()}
            className="bg-primary-container text-on-primary-container px-sm py-2 rounded-xl font-label-bold text-label-bold hover:bg-primary-container/90 transition-colors active:scale-95"
          >
            検索
          </button>
        </div>
      </div>
      <button
        className={`${isRestaurantsDataFetching ? "aa" : "w-full md:w-auto md:self-center border-2 border-primary text-primary px-lg py-3 rounded-full font-label-bold text-label-bold flex items-center justify-center gap-xs hover:bg-primary hover:text-white transition-colors duration-300 active:scale-95 mt-xs"}`}
        onClick={handleLocationButtonClick}
        disabled={isRestaurantsDataFetching}
      >
        <span className="material-symbols-outlined" data-icon="near_me">
          {isRestaurantsDataFetching ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaLocationArrow />
          )}
        </span>
        {isRestaurantsDataFetching ? "読み込み中..." : "現在地周辺から探す"}
      </button>
    </section>
  );
};
