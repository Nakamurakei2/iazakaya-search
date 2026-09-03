"use client";

import { RestaurantType } from "@/types/restaurant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdFavorite, MdFavoriteBorder, MdSearch } from "react-icons/md";

type SortKey = "recent" | "name";

type Props = {
  data: RestaurantType[];
  totalFavorites: string;
};

export default function FavoritesForm(props: Props) {
  const { data, totalFavorites } = props;
  const router = useRouter();
  const [favorites, setFavorites] = useState<RestaurantType[]>(data);
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // お気に入り登録

  // const handleRemoveFavorite = (restaurantId: number) => {
  //   setFavorites((prev) =>
  //     prev.filter((favorite) => favorite.id !== restaurantId),
  //   );
  // };
  // 並び替え後のレストラン
  const sortFavorites = (favorites: RestaurantType[], sortKey: SortKey) => {
    return [...favorites].sort((a, b) => {
      if (sortKey === "name") {
        return a.name_kana.localeCompare(b.name_kana, "ja");
      }

      if (!a.created_at) return 1;
      if (!b.created_at) return -1;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  };
  const sortedFavorites = sortFavorites(favorites, sortKey);

  const handleRemoveFavorite = () => {
    // 削除確認ダイアログを表示させる
    // setConfirmTarget(selected);
  };

  return (
    <div className="min-h-screen bg-[#131313] pb-32 text-[#e5e2e1]">
      {/* Main */}
      <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-24">
        {/* Page Title */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-[28px] font-bold leading-9 text-[#ffb77d] md:text-[32px] md:leading-10">
              Favorites
            </h2>

            <p className="text-[14px] leading-6 text-[#ddc1ae]">
              Your saved spots for the perfect night out.
            </p>
          </div>

          <span className="text-[14px] rounded-full bg-[#c68315]/20 px-3 py-1 text-sm font-bold text-[#ffb95a]">
            {favorites.length} Saved
          </span>
        </div>

        {/* Favorites */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="relative overflow-hidden rounded-[24px] bg-[#2a2a2a] shadow-[0px_10px_30px_rgba(255,140,0,0.08)] transition-transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 w-full">
                  <img
                    src={favorite.photo.pc.l}
                    alt={favorite.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Genre / Rating */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    {/* <span className="rounded bg-[#ffb77d]/80 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      {favorite.genre}
                    </span> */}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    // onClick={() => handleRemoveFavorite(favorite.id)}
                    aria-label={`${favorite.name}をお気に入りから削除`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#131313]/50 text-[#ffb77d] backdrop-blur-md transition-colors hover:bg-[#131313]/80"
                  >
                    <MdFavorite className="text-xl" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="mb-1 text-2xl font-bold leading-8 text-[#e5e2e1]">
                    {favorite.name}
                  </h3>
                  {/* 
                  <p className="mb-4 flex items-center text-[16px] leading-6 text-[#ddc1ae]">
                    <MdLocationOn className="mr-1 text-sm opacity-70 scale-14 mt-2" />
                    <span>
                      <b className="font-bold">
                         {favorite.distanceKm < 1
                          ? `${Math.round(shop.distanceKm * 1000)}m`
                          : `${favorite.distanceKm.toFixed(2)}km`} 
                      </b>
                    </span>
                  </p> */}

                  <div className="flex gap-2">
                    <Link
                      href={`/restaurant/${favorite.id}`}
                      className="flex-1 rounded-lg bg-[#353534] py-2 text-center text-sm font-bold text-[#e5e2e1] transition-colors hover:bg-[#393939]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#353534] opacity-50">
              <MdFavoriteBorder className="text-[64px] text-[#ddc1ae]" />
            </div>

            <h3 className="mb-2 text-2xl font-bold leading-8 text-[#e5e2e1]">
              No favorites yet
            </h3>

            <p className="mb-8 max-w-sm text-[16px] leading-6 text-[#ddc1ae]">
              Start exploring and save your favorite Izakayas for your next
              night out.
            </p>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-full bg-[#ffb77d] px-8 py-4 text-sm font-bold text-[#4d2600] transition-colors hover:bg-[#ffdcc3]"
            >
              <MdSearch className="text-xl" />
              Go Search
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      {/* <nav className="fixed right-5 top-0 z-50 hidden h-[72px] items-center gap-6 text-sm font-bold text-[#ddc1ae] md:flex">
        <Link
          href="/"
          className="flex items-center gap-2 transition-colors hover:text-[#ffb77d]"
        >
          <MdSearch />
          Search
        </Link>

        <Link
          href="/favorites"
          className="flex items-center gap-2 text-[#ffb77d]"
        >
          <MdFavorite />
          Favorites
        </Link>

        <Link
          href="/recent"
          className="flex items-center gap-2 transition-colors hover:text-[#ffb77d]"
        >
          <MdHistory />
          Recent
        </Link>
      </nav> */}
    </div>
  );
}
