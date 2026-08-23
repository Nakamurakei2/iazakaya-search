import { useSearchContext } from "@/context/search-context";
import { useMutationRestaurant } from "@/services/api";
import { Izakayas } from "@/types/restaurant";
import { SearchMode } from "../search-panel";

type Props = {
  setIzakayas: React.Dispatch<React.SetStateAction<Izakayas[]>>;
  pageSize: number;
};

export const Pagination = (props: Props) => {
  const { setIzakayas, pageSize } = props;
  const { searchCondition, pageStart, setPageStart } = useSearchContext();
  const { mutate } = useMutationRestaurant();

  // ページ変更と通信を連動させる共通関数
  const handlePageChange = (newPageStart: number): void => {
    if (!searchCondition) return;
    setPageStart(newPageStart);
    if (searchCondition.mode === SearchMode.inputMode) {
      // 入力値での検索の場合
      mutate(
        {
          start: newPageStart,
          station: searchCondition.keyword,
          count: pageSize,
        },
        {
          onSuccess: (data: Izakayas[]) => {
            setIzakayas(data);
          },
        },
      );
      // scroll
    } else if (
      searchCondition.mode === SearchMode.locationMode &&
      searchCondition.keyword.lat &&
      searchCondition.keyword.lng
    ) {
      // 現在位置からの検索の場合
      mutate(
        {
          lat: searchCondition.keyword.lat,
          lng: searchCondition.keyword.lng,
          start: newPageStart,
          count: pageSize, // 1ページあたりの件数を指定
        },
        {
          onSuccess: (mutateData: Izakayas[]) => {
            if (mutateData) setIzakayas(mutateData);
          },
        },
      );
    }
  };

  const onPreviousButtonClick = () => {
    const nextStart = Math.max(1, pageStart - pageSize);
    handlePageChange(nextStart);
  };

  const onClickNextButtonClick = () => {
    const nextStart = pageStart + 10;
    handlePageChange(nextStart);
  };

  return (
    <div className="pagination-container">
      <nav className="pagination-nav" aria-label="ページネーション">
        <button className="page-btn" onClick={onPreviousButtonClick}>
          &lt; 前へ
        </button>
        <div className="page-numbers"></div>
        <button className="page-btn" onClick={onClickNextButtonClick}>
          次へ &gt;
        </button>
      </nav>
    </div>
  );
};
