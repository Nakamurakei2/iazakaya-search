import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalRestaurants: number;
  handlePaginatePrevious: () => void;
  handlePaginateNext: () => void;
  handlePaginateButtonClick: (pageNumber: number) => void;
};

export const Pagination = (props: Props) => {
  const {
    page,
    totalRestaurants,
    handlePaginatePrevious,
    handlePaginateNext,
    handlePaginateButtonClick,
  } = props;

  return (
    <div className="pagination" aria-label="ページ送り">
      <button
        className="page-btn"
        onClick={handlePaginatePrevious}
        disabled={page === 1}
        aria-label="前のページ"
      >
        <ChevronLeft size={16} />
      </button>

      {(() => {
        const pageNumbers: (number | string)[] = [];
        const range = 1; // 現在のページの前後に表示するボタンの数

        for (let i = 1; i <= totalRestaurants; i++) {
          if (
            i === 1 ||
            i === totalRestaurants ||
            (i >= page - range && i <= page + range)
          ) {
            pageNumbers.push(i);
          } else if (i === page - range - 1 || i === page + range + 1) {
            pageNumbers.push("...");
          }
        }

        return pageNumbers.map((n, index) => {
          if (n === "...") {
            return (
              <span key={`ellipsis-${index}`} className="page-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={n}
              onClick={() => {
                handlePaginateButtonClick(Number(n));
              }}
              className={`page-num ${n === page ? "page-num-active" : ""}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          );
        });
      })()}

      <button
        className="page-btn"
        onClick={handlePaginateNext}
        disabled={page === totalRestaurants}
        aria-label="次のページ"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
