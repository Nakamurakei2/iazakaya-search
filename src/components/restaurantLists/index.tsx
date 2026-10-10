import { GENRE_STYLE, ShopsType } from "@/types/restaurant";
import { NoRestaurants } from "../noRestaurants";
import { FaStar } from "react-icons/fa";
import { SetStateAction } from "react";

type Props = {
  isRestaurantsDataFetching: boolean;
  displayShops: ShopsType[];
  totalRestaurants: number;
  setSelectedId: React.Dispatch<SetStateAction<string>>;
  locationNotice: string;
};

export const RestaurantLists = (props: Props) => {
  const {
    isRestaurantsDataFetching,
    displayShops,
    totalRestaurants,
    setSelectedId,
    locationNotice,
  } = props;

  /**
   * 詳細モーダル展開
   */
  const handleDescriptionModal = async (shop: ShopsType) => {
    setSelectedId(shop.id);
    try {
      const res = await fetch(`/api/restaurants/${shop.id}/recent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(shop),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("data!!!", data);
        return;
      }
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  return (
    <section className="col-span-4 md:col-span-12">
      {/* 一覧 */}
      {!isRestaurantsDataFetching && displayShops?.length === 0 && (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-primary"
                data-icon="star"
                data-weight="fill"
              >
                <FaStar />
              </span>
              周辺のお店
            </h3>
            <p className="recent-search-icon-secondary">
              {totalRestaurants !== 0 && `${totalRestaurants}件`}
            </p>
          </div>
          <NoRestaurants />
        </>
      )}
      {displayShops?.map((shop) => {
        const code = shop.genre.code;
        const style = GENRE_STYLE[code as keyof typeof GENRE_STYLE] || {
          c: "#8C6A4E",
        };

        return (
          <div
            key={shop.id}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-5"
            onClick={() => handleDescriptionModal(shop)}
          >
            <article className="bg-[#ffffff] text-[#121212] rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(255,140,0,0.08)] flex flex-col group cursor-pointer hover:shadow-[0px_15px_40px_rgba(255,140,0,0.15)] transition-shadow duration-300">
              <div className="relative h-48 w-full overflow-hidden">
                <div
                  className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                  data-alt="A warm, inviting photo of a modern Japanese izakaya interior, featuring glowing paper lanterns, rich wooden counters, and a lively atmosphere. A plate of freshly grilled yakitori is in the foreground, illuminated by soft amber lighting against a dark, moody background. High quality, appetizing."
                  style={{
                    backgroundImage: `url(${shop.photo.pc.l})`,
                  }}
                ></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="p-sm flex flex-col gap-base flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="font-headline-md text-[20px] leading-[28px] font-bold">
                    {shop.name}
                  </h4>
                  <span className="text-surface-variant font-label-sm whitespace-nowrap mt-1">
                    {locationNotice && (
                      <span>
                        {locationNotice}{" "}
                        <b className="font-bold">
                          {shop.distanceKm < 1
                            ? `${Math.round(shop.distanceKm * 1000)}m`
                            : `${shop.distanceKm.toFixed(2)}km`}
                        </b>
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-surface-variant font-body-md text-body-md line-clamp-2">
                  {shop.catch}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto pt-sm">
                  <span
                    className="genre-tag"
                    style={{
                      backgroundColor:
                        GENRE_STYLE[shop.genre.code]?.c ?? "#888888",
                      borderColor: GENRE_STYLE[shop.genre.code]?.c ?? "#888888",
                    }}
                  >
                    {shop.genre.name}
                  </span>

                  {shop.sub_genre ? (
                    <span
                      className="genre-tag"
                      style={{
                        backgroundColor:
                          GENRE_STYLE[shop.sub_genre.code]?.c ?? "#888888",
                        borderColor:
                          GENRE_STYLE[shop.sub_genre.code]?.c ?? "#888888",
                      }}
                    >
                      {shop.sub_genre.name}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </section>
  );
};
