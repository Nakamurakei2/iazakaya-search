import { Search } from "lucide-react";
import React, { SetStateAction, useRef, useState } from "react";
import { FaLocationArrow, FaSpinner, FaTrain } from "react-icons/fa";
import { GoArrowUpLeft } from "react-icons/go";

type Station = {
  station_id: number;
  name: string;
  lat: number;
  lon: number;
  address: string;
};

type Props = {
  stationName: string;
  setStationName: React.Dispatch<SetStateAction<string>>;
  isRestaurantsDataFetching: boolean;
  handleSearch: () => void;
  handleLocationButtonClick: () => Promise<void>;
  predictiveSearch: boolean;
  setPredictiveSearch: React.Dispatch<SetStateAction<boolean>>;
};

export const SearchForm = (props: Props) => {
  const {
    stationName,
    setStationName,
    isRestaurantsDataFetching,
    handleSearch,
    handleLocationButtonClick,
    predictiveSearch,
    setPredictiveSearch,
  } = props;

  const [stationSuggestions, setStationSuggestions] = useState<Station[]>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 検索欄に入力時の処理
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setStationName(inputValue);

    // 前回のタイマーをキャンセル
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 空文字なら検索しない
    if (!inputValue.trim()) {
      setPredictiveSearch(false);
      setStationSuggestions([]);
      return;
    }

    setPredictiveSearch(true);

    // 入力が止まってから500ms後に検索
    timerRef.current = setTimeout(async () => {
      const param = new URLSearchParams({ inputValue });

      try {
        const res = await fetch(`/api/stations?${param}`, {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) return;

        const data = await res.json();
        setStationSuggestions(data.stations);
      } catch (error: unknown) {
        console.error("駅候補の取得に失敗しました", error);
      }
    }, 500);
  };

  /**
   * 予測検索候補押下時処理
   */
  const handleClick = async (station: Station) => {
    // 検索窓にnameを挿入
    setStationName(station.name);
    setPredictiveSearch(false);
  };

  return (
    <section className="col-span-4 md:col-span-8 md:col-start-3 flex flex-col gap-sm mb-lg">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background text-center mb-xs">
        今夜のお店を探す
      </h2>

      <div className="relative w-full overflow-visible">
        {/* 検索欄 */}
        <div className="relative w-full rounded-2xl bg-surface-bright shadow-[0px_10px_30px_rgba(255,140,0,0.08)] flex items-center border border-surface-container-highest focus-within:border-primary transition-colors duration-300">
          <div className="pl-md flex items-center text-on-surface-variant">
            <Search />
          </div>

          <input
            className="w-full bg-transparent border-none focus:ring-0 text-on-background font-body-lg text-body-lg px-sm py-4 placeholder-on-surface-variant/50"
            placeholder="駅名で検索（例：渋谷）"
            type="text"
            value={stationName}
            onChange={handleChange}
          />

          <div className="pr-sm">
            <button
              type="button"
              onClick={handleSearch}
              className="text-12px bg-primary-container text-on-primary-container px-sm py-2 rounded-xl font-label-bold text-label-bold hover:bg-primary-container/90 transition-colors active:scale-95"
            >
              検索
            </button>
          </div>
        </div>

        {/* 検索候補リスト */}

        {stationSuggestions && predictiveSearch && (
          <div className="p-1.5 flex flex-col gap-2 absolute search-lists right-0 left-0 predict-inputs">
            {stationSuggestions.map((station) => (
              <button
                key={station.station_id}
                type="button"
                onClick={() => handleClick(station)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bright/70 active:scale-[0.99] transition-all text-left group"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[18px] color-primary-background-grey">
                      <FaTrain />
                    </span>
                  </div>

                  <div className="min-w-0 flex-grow">
                    <div className="text-body-md font-normal text-on-background flex items-center gap-2 flex-wrap">
                      <span className="text-[15px]">
                        {/* <span className="text-primary font-bold">
                        {station.highlight}
                      </span> */}
                        {/* {station.name.slice(station.highlight.length)} */}
                        {station.name}
                      </span>
                    </div>

                    <div className="text-label-sm text-on-surface-variant text-[11px] truncate mt-0.5">
                      {station.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`px-2 py-0.5 rounded-full text-[11px]`}>
                    {/* {station.count}件 */}
                  </span>

                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
                    <GoArrowUpLeft />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        className={`${isRestaurantsDataFetching ? "aa" : "w-full md:w-auto md:self-center text-primary px-lg py-3 font-label-bold text-label-bold flex items-center justify-center gap-xs hover:bg-primary hover:text-white transition-colors duration-300 active:scale-95 mt-xs"}`}
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
