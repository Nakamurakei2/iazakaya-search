import { Izakayas } from "@/types/restaurant";
import { Ref, useState } from "react";
import { VenueCard } from "../venue-card";
import { formatVenue } from "@/hooks/format-restaurant-data";
import { Pagination } from "../pagination";
import { Modal } from "../modal";

export const pageSizeOptions = [5, 10, 20, 50] as const;

type Props = {
  izakayas: Izakayas[];
  setIzakayas: React.Dispatch<React.SetStateAction<Izakayas[]>>;
  count: (typeof pageSizeOptions)[number];
  setCount: React.Dispatch<
    React.SetStateAction<(typeof pageSizeOptions)[number]>
  >;
  scrollRef: Ref<HTMLDivElement>;
};

export const RoutePatterns = (props: Props) => {
  const { izakayas, setIzakayas, count, setCount, scrollRef } = props;

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedIzakaya, setSelectedIzakaya] = useState<Izakayas | null>(null);

  return (
    <>
      <section className="results-panel">
        <div className="toolbar">
          <div className="display-row" ref={scrollRef}>
            <p className="eyebrow">Restaurants</p>
            {/* <h2>おすすめパターン</h2> */}
            <select
              value={count}
              onChange={(e) =>
                setCount(
                  e.target.value as unknown as (typeof pageSizeOptions)[number],
                )
              }
            >
              {pageSizeOptions.map((size, index) => (
                <option key={index} value={size}>
                  {size}件
                </option>
              ))}
            </select>
          </div>
          {/* <button className="ghost-button" type="button">
                条件を保存
              </button> */}
        </div>

        {izakayas.length > 0 ? (
          <>
            <div className="route-list">
              {izakayas.map((izakaya, index) => (
                <VenueCard
                  key={index}
                  order={`${index + 1}番目`}
                  venue={formatVenue(izakaya)}
                  onClick={() => {
                    setModalOpen(true);
                    setSelectedIzakaya(izakaya);
                  }}
                />
              ))}
            </div>
            <Pagination pageSize={count} setIzakayas={setIzakayas} />
            {/* <div className="detail-layout">
              <VenueCard order="1軒目" venue={currentPlan.first} />
              <div className="move-card">
                <span>移動</span>
                <strong>{currentPlan.move}</strong>
                <p>二軒目の席開始を21:20で仮押さえ</p>
              </div>
              <VenueCard order="2軒目" venue={currentPlan.second} />
            </div> */}
          </>
        ) : (
          <></>
        )}
      </section>
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          title="店舗の詳細情報"
          onClose={() => setModalOpen(false)}
          izakaya={selectedIzakaya}
        />
      )}
    </>
  );
};
