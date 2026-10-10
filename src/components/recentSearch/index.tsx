import { RefObject } from "react";
import { IoMdTrain } from "react-icons/io";
import { IoBeer } from "react-icons/io5";
import { MdOutlineRestaurant } from "react-icons/md";

type Props = {
  scrollRef: RefObject<HTMLDivElement | null>;
};

export const RecentSearch = (props: Props) => {
  const { scrollRef } = props;

  return (
    <section className="recent-search-section" ref={scrollRef}>
      <h3 className="recent-search-title">最近の検索</h3>

      <div className="recent-search-list">
        <button className="recent-search-item">
          <IoMdTrain className="recent-search-icon recent-search-icon-primary" />
          <span>新宿駅</span>
        </button>

        <button className="recent-search-item">
          <IoMdTrain className="recent-search-icon recent-search-icon-primary" />
          <span>渋谷駅</span>
        </button>

        <button className="recent-search-item">
          <MdOutlineRestaurant className="recent-search-icon recent-search-icon-secondary" />
          <span>焼き鳥</span>
        </button>

        <button className="recent-search-item">
          <IoBeer className="recent-search-icon recent-search-icon-secondary" />
          <span>クラフトビール</span>
        </button>
      </div>
    </section>
  );
};
