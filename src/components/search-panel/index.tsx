import { FaSearch } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import { useState } from "react";
import { Genre, Izakayas } from "@/types/restaurant";
import { useSearchContext } from "@/context/search-context";
import { useMutationRestaurant } from "@/services/api";
import { currentLocation } from "@/hooks/current-location";
import { AdvancedSearch } from "../advanced-search";

export enum SearchMode {
  inputMode = "0", // 入力値から検索
  locationMode = "1", // 現在位置から検索
}

type Props = {
  station: string | undefined;
  setStation: React.Dispatch<React.SetStateAction<string>>;
  people: number;
  setPeople: React.Dispatch<React.SetStateAction<number>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  setIzakayas: React.Dispatch<React.SetStateAction<Izakayas[]>>;
  pageStart: number;
  count: number;
};

export const SearchPanel = (props: Props) => {
  const {
    station,
    setStation,
    people,
    setPeople,
    date,
    setDate,
    time,
    setTime,
    setIzakayas,
    pageStart,
    count,
  } = props;
  // fetch用検索文字入力値
  const [searchStation, setSearchStation] = useState<string>("");
  const [scene, setScene] = useState<Genre | undefined>();
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(true);
  const [genreValue, setGenreValue] = useState<Genre>(Genre.G001);
  const { setSearchCondition } = useSearchContext();

  const { mutate, isPending } = useMutationRestaurant();

  /**
   * 検索処理
   * @param mode 0 | 1
   */
  const handleSearch = async (mode: SearchMode) => {
    // 入力値から検索
    if (mode === SearchMode.inputMode) {
      if (!station) return;
      setSearchStation(station);

      mutate(
        {
          station: station,
          start: pageStart,
          count: count,
          genre: genreValue,
        },
        {
          onSuccess: (mutateData: Izakayas[]) => {
            setIzakayas(mutateData);
            setSearchCondition({
              mode: SearchMode.inputMode,
              keyword: searchStation,
            });
          },
        },
      );
    }
    // 現在位置から検索
    else if (mode === SearchMode.locationMode) {
      try {
        const { latitude, longitude } = await currentLocation();
        mutate(
          {
            lat: latitude,
            lng: longitude,
            start: pageStart,
            count: count,
            genre: genreValue,
          },
          {
            onSuccess: (mutateData: Izakayas[]) => {
              if (mutateData) {
                setIzakayas(mutateData);
                setStation("");
                setSearchCondition({
                  mode: SearchMode.locationMode,
                  keyword: {
                    lat: latitude,
                    lng: longitude,
                  },
                });
              }
            },
          },
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  };

  return (
    <>
      <aside className="search-panel" aria-label="検索条件">
        <div className="brand-row">
          <div>
            <p className="eyebrow">Restaurant Search</p>
            <h1>レストラン検索</h1>
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="station">駅</label>
          <div className="display-row">
            <input
              id="station"
              type="text"
              placeholder="駅名で検索"
              value={station}
              onChange={(event) => setStation(event.target.value)}
            />
            <button
              className="search-button active"
              onClick={() => handleSearch(SearchMode.inputMode)}
            >
              <FaSearch className="search-icon" />
            </button>
          </div>
          <button
            className="current-location"
            onClick={() => handleSearch(SearchMode.locationMode)}
          >
            <TbCurrentLocation />
            現在地から検索
          </button>
        </div>
        <AdvancedSearch
          isToggleOpen={isToggleOpen}
          setIsToggleOpen={setIsToggleOpen}
          scene={scene}
          setScene={setScene}
          people={people}
          setPeople={setPeople}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          searchStation={searchStation}
          genreValue={genreValue}
          setGenreValue={setGenreValue}
        />
      </aside>
    </>
  );
};
