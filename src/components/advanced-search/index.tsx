import { useMutationRestaurant } from "@/services/api";
import { Budget, Genre, genres } from "@/types/restaurant";
import React, { useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

type Props = {
  isToggleOpen: boolean;
  setIsToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scene: Genre | undefined;
  setScene: React.Dispatch<React.SetStateAction<Genre | undefined>>;
  people: number;
  setPeople: React.Dispatch<React.SetStateAction<number>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  searchStation: string;
  genreValue: Genre | undefined;
  setGenreValue: React.Dispatch<React.SetStateAction<Genre>>;
};

export const AdvancedSearch = (props: Props) => {
  const {
    isToggleOpen,
    setIsToggleOpen,
    scene,
    setScene,
    people,
    setPeople,
    date,
    setDate,
    time,
    setTime,
    searchStation,
    genreValue,
    setGenreValue,
  } = props;

  const [budget, setBudget] = useState<Budget>("standard");

  /**
   * 詳細検索ボタン（上記で検索ボタン）押下時処理
   */
  const hadleAdvencedSearchBtn = () => {
    console.log("genreValue", genreValue);
  };

  return (
    <>
      <div className="field-group">
        <div
          className="display-row"
          onClick={() => setIsToggleOpen(!isToggleOpen)}
        >
          <label>詳細検索</label>
          <GoTriangleDown className={isToggleOpen ? "" : "hidden"} />
          <GoTriangleUp className={isToggleOpen ? "hidden" : ""} />
        </div>

        {/* 場所（デフォルトでは居酒屋） */}
        <div
          className={isToggleOpen ? "segmented" : "hidden"}
          role="group"
          aria-label=" "
        >
          <select
            value={scene}
            onChange={(e) => {
              const selectedValue = e.target.value as Genre;
              setScene(selectedValue);
              setGenreValue(selectedValue);
            }}
          >
            {genres.map((item) => {
              return (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 距離 */}
      <div className={isToggleOpen ? "segmented" : "hidden"}>
        {/* 入力した駅or */}
      </div>
      <div className={isToggleOpen ? "inline-fields" : "hidden"}>
        <div className="field-group">
          <label htmlFor="people">人数</label>
          <input
            id="people"
            max="20"
            min="2"
            type="number"
            value={people}
            onChange={(event) => setPeople(Number(event.target.value))}
          />
        </div>
        <div className="field-group">
          <label htmlFor="date">日付</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
      {/* <div className={isToggleOpen ? " inline-fields" : "hidden"}>
        <div className="field-group">
          <label htmlFor="time">開始</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </div>
        <div className="field-group">
          <label>予算感</label>
          <div className="budget-list">
            {budgets.map((item) => (
              <button
                className={budget === item.value ? "active" : ""}
                key={item.value}
                onClick={() => setBudget(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div> */}
      {/* <div className={isToggleOpen ? " summary-box" : "hidden"}>
        <span>検索条件</span>
        <strong>
          {station} / {scenario} / {people}名
        </strong>
        <p>
          {date} {time}
          開始で、二軒目までの移動距離が短い順に候補を表示します。
        </p>
      </div> */}

      <button
        className={isToggleOpen ? "advanced-search" : "hidden"}
        onClick={hadleAdvencedSearchBtn}
      >
        上記で検索
      </button>
    </>
  );
};
