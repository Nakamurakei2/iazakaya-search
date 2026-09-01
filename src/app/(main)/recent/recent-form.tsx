"use client";

import {
  MdLocationOn,
  MdSearch,
  MdFavorite,
  MdHistory,
  MdPerson,
  MdStar,
  MdArrowForward,
} from "react-icons/md";

type RecentShop = {
  id: string;
  name: string;
  rating: number;
  area: string;
  image: string;
};

type Props = {
  todayShops: RecentShop[];
  yesterdayShops: RecentShop[];
  onSelect: (shopId: string) => void;
};

export default function RecentPage({
  todayShops,
  yesterdayShops,
  onSelect,
}: Props) {
  /**
   * 履歴カード
   */
  const RecentCard = ({ shop }: { shop: RecentShop }) => {
    return (
      <div className="group relative flex h-[120px] overflow-hidden rounded-[24px] bg-[#201f1f] shadow-[0px_10px_30px_rgba(255,140,0,0.08)] transition-transform hover:-translate-y-1">
        {/* Image */}
        <div className="h-full w-[120px] shrink-0">
          <img
            className="h-full w-full object-cover"
            src={shop.image}
            alt={shop.name}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h4 className="line-clamp-1 text-[18px] font-medium leading-7 text-[#e5e2e1]">
              {shop.name}
            </h4>

            <p className="mt-1 flex items-center gap-1 text-xs font-semibold leading-4 text-[#ddc1ae]">
              <MdStar className="text-[14px]" />
              {shop.rating} • {shop.area}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelect(shop.id)}
            className="flex items-center gap-1 self-end text-sm font-bold leading-5 text-[#ffb77d] transition-colors hover:text-[#ff8c00]"
          >
            View
            <MdArrowForward className="text-[16px]" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#131313] pb-24 text-[#e5e2e1] md:pb-0">
      {/* Top App Bar */}
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-[#131313]/80 px-5 py-2 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <MdLocationOn className="text-2xl text-[#ffb77d]" />

          <h1 className="text-2xl font-bold text-[#ffb77d]">Izakaya Finder</h1>
        </div>

        {/* Profile */}
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#353534]">
          <img
            src="/images/profile.jpg"
            alt="User profile"
            className="h-full w-full object-cover"
          />
        </div>
      </header>

      {/* Main */}
      <main className="mt-6 px-5 pt-20 md:mx-auto md:max-w-[1200px]">
        <h2 className="mb-8 text-[28px] font-bold leading-9 text-[#e5e2e1] md:text-[32px] md:leading-10">
          Recent Views
        </h2>

        {/* Today */}
        {todayShops.length > 0 && (
          <section className="mb-12">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ddc1ae]">
              Today
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todayShops.map((shop) => (
                <RecentCard key={shop.id} shop={shop} />
              ))}
            </div>
          </section>
        )}

        {/* Yesterday */}
        {yesterdayShops.length > 0 && (
          <section className="mb-12">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ddc1ae]">
              Yesterday
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {yesterdayShops.map((shop) => (
                <RecentCard key={shop.id} shop={shop} />
              ))}
            </div>
          </section>
        )}

        {/* Empty */}
        {todayShops.length === 0 && yesterdayShops.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[16px] text-[#ddc1ae]">No recent views.</p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-[#353534]/80 px-4 pb-4 pt-2 shadow-lg backdrop-blur-xl md:hidden">
        {/* Search */}
        <a
          href="#"
          className="flex flex-col items-center justify-center text-[#ddc1ae] transition-transform hover:text-[#ffb77d] active:scale-90"
        >
          <MdSearch className="mb-1 text-2xl" />
          <span className="text-xs font-semibold">Search</span>
        </a>

        {/* Favorites */}
        <a
          href="#"
          className="flex flex-col items-center justify-center text-[#ddc1ae] transition-transform hover:text-[#ffb77d] active:scale-90"
        >
          <MdFavorite className="mb-1 text-2xl" />
          <span className="text-xs font-semibold">Favorites</span>
        </a>

        {/* Recent */}
        <a
          href="#"
          className="flex flex-col items-center justify-center gap-1 rounded-full bg-[#ff8c00] px-4 py-1 text-[#623200] transition-transform active:scale-90"
        >
          <MdHistory className="text-2xl" />
          <span className="text-xs font-semibold">Recent</span>
        </a>

        {/* Profile */}
        <a
          href="#"
          className="flex flex-col items-center justify-center text-[#ddc1ae] transition-transform hover:text-[#ffb77d] active:scale-90"
        >
          <MdPerson className="mb-1 text-2xl" />
          <span className="text-xs font-semibold">Profile</span>
        </a>
      </nav>
    </div>
  );
}
