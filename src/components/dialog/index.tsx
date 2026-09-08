"use client";

import { handleAddFavoritesButtonClick } from "@/services/restaurant-api";
import { ShopsType } from "@/types/restaurant";
import { googleMapUrl } from "@/utils/location";
import { Heart, HeartOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FaMoneyCheck, FaRegCalendarAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineRestaurant } from "react-icons/md";

type Props = {
  selected: ShopsType;
  setSelectedId: Dispatch<SetStateAction<string>>;
  favoriteIds: string[];
  setFavoriteIds?: Dispatch<SetStateAction<string[]>>;
  authorized: boolean;
  handleRemoveFavorites: () => void;
};

/**
 *
 * @param props 詳細ダイアログ
 * @returns
 */
export const Dialog = (props: Props) => {
  const {
    selected,
    setSelectedId,
    favoriteIds,
    setFavoriteIds,
    authorized,
    handleRemoveFavorites,
  } = props;

  /**
   * お気に入り登録ボタン
   */
  const handleAddFavorites = async (id: string): Promise<void> => {
    const restaurantId = await handleAddFavoritesButtonClick({
      restaurantId: id,
    });
    if (restaurantId && setFavoriteIds)
      setFavoriteIds((prev) => [...prev, restaurantId]);

    setSelectedId(""); // 詳細ダイアログ閉じる
  };

  /**
   * 予約ボタン
   */
  const handleReserveButton = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="antialiased min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Dialog Overlay */}
      <div
        onClick={() => setSelectedId("")}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xl md:items-center md:p-5"
      >
        {/* Dialog */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[90vh] w-full flex-col overflow-hidden rounded-t-xl bg-[#2a2a2a] shadow-[0_10px_30px_rgba(255,140,0,0.08)] md:h-auto md:max-h-[85vh] md:max-w-[600px] md:rounded-xl"
        >
          {/* Close */}
          <button
            onClick={() => setSelectedId("")}
            type="button"
            aria-label="Close dialog"
            className="close-button absolute right-4 top-2 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black"
          >
            <IoIosClose className="scale-14" />
          </button>

          {/* Scroll Area */}
          <div className="flex-grow overflow-y-auto pb-[80px]">
            {/* Hero */}
            <div className="relative h-[250px] w-full md:h-[300px]">
              <img
                className="h-full w-full object-cover"
                data-alt="A high-quality close-up shot of traditional Japanese Yakitori cooking over binchotan charcoal."
                src={selected.photo.pc.l}
                alt="炭火焼鳥"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-6 px-5 py-6">
              {/* Restaurant Header */}
              <div>
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h2 className="text-[28px] font-bold leading-9 text-[#e5e2e1] md:text-[32px] md:leading-10">
                    {selected.name}
                  </h2>
                </div>

                <p className="flex items-center text-[16px] leading-6 text-[#ddc1ae]">
                  <span className="material-symbols-outlined mr-1 text-[18px] mr-3">
                    <MdOutlineRestaurant className="scale-12" />
                  </span>
                  {selected.genre && selected.genre.name}
                  {selected.sub_genre && `/ ${selected.sub_genre.name}`}
                </p>
              </div>

              {/* Description */}
              <p className="text-[16px] leading-7 text-[#fff]">
                {selected.mobile_access} <br />
                {selected.catch}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#201f1f] p-4">
                {/* Price */}
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#ffb77d]">
                    <FaMoneyCheck className="scale-12" />
                  </span>

                  <div>
                    <p className="text-[12px] font-semibold leading-4 text-[#ddc1ae]">
                      Avg. Price
                    </p>

                    <p className="text-[14px] font-bold leading-5 text-[#e5e2e1]">
                      {selected.budget.name}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                {/* <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#ffb77d]">
                    <MdAccessTimeFilled />
                  </span>

                  <div>
                    <p className="text-[12px] font-semibold leading-4 text-[#ddc1ae]">
                      Hours
                    </p>

                    <p className="text-[14px] font-bold leading-5 text-[#e5e2e1]">
                      {selected.open}
                    </p>
                  </div>
                </div> */}
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-2 flex items-center text-[18px] font-medium leading-7 text-[#e5e2e1]">
                  <span className="material-symbols-outlined mr-2 text-[#ffb77d]">
                    <IoLocationOutline className="scale-12" />
                  </span>
                  Location
                </h3>
                <div className="iframe-container relative h-32 w-full overflow-hidden rounded-lg bg-[#353534]">
                  <iframe
                    src={`https://www.google.com/maps?q=${selected.lat},${selected.lng}&output=embed`}
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  />

                  <div className="absolute inset-0 bg-[#353534]/10 mix-blend-overlay" />
                </div>
                <p className="mt-2 text-[13px] leading-6 text-[#ddc1ae]">
                  {selected.access}
                </p>
                <a
                  href={googleMapUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline mt-2"
                >
                  Google Mapsで経路を見る
                </a>{" "}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 z-20 flex w-full gap-4 border-t border-[#564334]/20 bg-[#353534]/90 p-4 px-5 backdrop-blur-lg">
            {favoriteIds.includes(selected.id) ? (
              <button
                type="button"
                className={`${authorized ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ffb77d]/50 text-[#ffb77d] transition-colors hover:bg-[#ffb77d]/10" : "hidden"}`}
                onClick={() => handleRemoveFavorites()}
              >
                <HeartOff className="scale-14" />
              </button>
            ) : (
              <button
                type="button"
                className={`${authorized ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ffb77d]/50 text-[#ffb77d] transition-colors hover:bg-[#ffb77d]/10" : "hidden"}`}
                onClick={() => handleAddFavorites(selected.id)}
              >
                <Heart className="scale-14" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleReserveButton(selected.urls.pc)}
              className="flex h-12 flex-grow items-center justify-center gap-2 rounded-xl bg-[#ffb77d] text-[14px] font-bold leading-5 text-[#4d2600] shadow-lg transition-colors hover:bg-[#ffdcc3]"
            >
              <span className="material-symbols-outlined">
                <FaRegCalendarAlt />
              </span>
              予約する (Reserve)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
