"use client";

import {
  MdLocationOn,
  MdHistory,
  MdSettings,
  MdChevronRight,
  MdNotifications,
  MdCreditCard,
  MdDescription,
  MdHelp,
  MdLogout,
  MdEdit,
  MdStar,
  MdRestaurant,
} from "react-icons/md";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#131313] pb-24 text-[#e5e2e1] md:pb-0">
      {/* Top App Bar */}
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-[#131313]/80 px-5 py-2 shadow-sm backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <MdLocationOn className="text-2xl text-[#ffb77d]" />

          <h1 className="text-2xl font-bold text-[#ffb77d]">Izakaya Finder</h1>
        </div>

        {/* Desktop Navigation */}
        {/* <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#ddc1ae] transition-all duration-300 hover:bg-[#353534]/50 active:scale-95"
          >
            <MdSearch className="text-xl" />
            Search
          </a>

          <a
            href="#"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#ddc1ae] transition-all duration-300 hover:bg-[#353534]/50 active:scale-95"
          >
            <MdFavorite className="text-xl" />
            Favorites
          </a>

          <a
            href="#"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#ddc1ae] transition-all duration-300 hover:bg-[#353534]/50 active:scale-95"
          >
            <MdHistory className="text-xl" />
            Recent
          </a>

          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-[#ff8c00] px-4 py-2 text-xs font-semibold text-[#623200]"
          >
            <MdPerson className="text-xl" />
            Profile
          </a>
        </nav> */}

        {/* Mobile Profile Icon */}
        <div className="h-8 w-8 overflow-hidden rounded-full bg-[#2a2a2a] md:hidden">
          <img
            className="h-full w-full object-cover"
            src="/images/profile.jpg"
            alt="Profile"
          />
        </div>
      </header>

      <div className="px-5 pt-[80px] md:mx-auto md:max-w-[800px] lg:mt-8">
        {/* Profile Header */}
        <section className="mb-12 mt-6 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4 h-32 w-32">
            <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-4 border-[#131313] bg-[#2a2a2a] shadow-[0px_10px_30px_rgba(255,140,0,0.08)]">
              <img
                className="h-full w-full object-cover"
                src="/images/profile.jpg"
                alt="Profile"
              />
            </div>

            {/* Edit */}
            <button
              type="button"
              className="absolute bottom-0 right-0 z-20 rounded-full bg-[#ffb77d] p-2 text-[#4d2600] shadow-lg transition-colors hover:bg-[#ffdcc3]"
            >
              <MdEdit className="text-sm" />
            </button>
          </div>

          <h2 className="mb-1 text-center text-[28px] font-bold leading-9 md:text-[32px] md:leading-10">
            Kenji Sato
          </h2>

          <p className="mb-4 text-center text-[16px] leading-6 text-[#ddc1ae]">
            kenji.sato@nightglow.jp
          </p>

          {/* Stats */}
          <div className="flex gap-4">
            <span className="flex items-center gap-2 rounded-full border border-[#564334] bg-[#2a2a2a] px-4 py-2 text-xs font-semibold text-[#ddc1ae]">
              <MdStar className="text-sm text-[#ffb77d]" />
              4.8 Rating
            </span>

            <span className="flex items-center gap-2 rounded-full border border-[#564334] bg-[#2a2a2a] px-4 py-2 text-xs font-semibold text-[#ddc1ae]">
              <MdRestaurant className="text-sm text-[#ffb77d]" />
              12 Reviews
            </span>
          </div>
        </section>

        {/* Menu */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Primary Action Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            {/* Account Settings */}
            <a
              href="#"
              className="group flex items-center justify-between rounded-2xl border border-[#393939] bg-[#201f1f] p-6 shadow-[0px_10px_30px_rgba(255,140,0,0.02)] transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb77d]/10 text-[#ffb77d] transition-colors group-hover:bg-[#ffb77d]/20">
                  <MdSettings className="text-2xl" />
                </div>

                <div>
                  <h3 className="text-sm font-bold leading-5 text-[#e5e2e1]">
                    Account Settings
                  </h3>

                  <p className="mt-1 text-xs font-semibold leading-4 text-[#ddc1ae]">
                    Personal details, password
                  </p>
                </div>
              </div>

              <MdChevronRight className="text-xl text-[#ddc1ae]" />
            </a>

            {/* Past Reservations */}
            <a
              href="#"
              className="group flex items-center justify-between rounded-2xl border border-[#393939] bg-[#201f1f] p-6 shadow-[0px_10px_30px_rgba(255,140,0,0.02)] transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb95a]/10 text-[#ffb95a] transition-colors group-hover:bg-[#ffb95a]/20">
                  <MdHistory className="text-2xl" />
                </div>

                <div>
                  <h3 className="text-sm font-bold leading-5 text-[#e5e2e1]">
                    Past Reservations
                  </h3>

                  <p className="mt-1 text-xs font-semibold leading-4 text-[#ddc1ae]">
                    View history, rebook
                  </p>
                </div>
              </div>

              <MdChevronRight className="text-xl text-[#ddc1ae]" />
            </a>
          </div>

          {/* List Menu */}
          <div className="overflow-hidden rounded-2xl border border-[#393939] bg-[#201f1f] md:col-span-2">
            {/* Notifications */}
            <a
              href="#"
              className="flex items-center justify-between border-b border-[#393939] p-4 transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-4">
                <MdNotifications className="text-xl text-[#ddc1ae]" />
                <span className="text-[16px] leading-6 text-[#e5e2e1]">
                  Notification Preferences
                </span>
              </div>

              <MdChevronRight className="text-xl text-[#ddc1ae]" />
            </a>

            {/* Payment */}
            <a
              href="#"
              className="flex items-center justify-between border-b border-[#393939] p-4 transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-4">
                <MdCreditCard className="text-xl text-[#ddc1ae]" />
                <span className="text-[16px] leading-6 text-[#e5e2e1]">
                  Payment Methods
                </span>
              </div>

              <MdChevronRight className="text-xl text-[#ddc1ae]" />
            </a>

            {/* Terms */}
            <a
              href="#"
              className="flex items-center justify-between border-b border-[#393939] p-4 transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-4">
                <MdDescription className="text-xl text-[#ddc1ae]" />
                <span className="text-[16px] leading-6 text-[#e5e2e1]">
                  Terms of Service
                </span>
              </div>

              <MdChevronRight className="text-xl text-[#ddc1ae]" />
            </a>

            {/* Help */}
            <a
              href="#"
              className="flex items-center justify-between p-4 transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-4">
                <MdHelp className="text-xl text-[#ddc1ae]" />
                <span className="text-[16px] leading-6 text-[#e5e2e1]">
                  Help &amp; Support
                </span>
              </div>

              <MdChevronRight className="text-xl text-[#ddc1ae]" />
            </a>
          </div>

          {/* Logout */}
          <div className="mb-8 mt-2 md:col-span-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-4 rounded-2xl border border-[#ffb4ab]/30 bg-[#201f1f] py-4 text-sm font-bold text-[#ffb4ab] transition-colors hover:bg-[#ffb4ab]/10"
            >
              <MdLogout className="text-xl" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
