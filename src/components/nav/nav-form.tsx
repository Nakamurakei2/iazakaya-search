import Link from "next/link";
import { FaRegHeart } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { MdHistory, MdOutlinePerson2 } from "react-icons/md";

export const NavigationForm = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pb-4 pt-2 bg-surface-container/80 dark:bg-surface-container-highest/80 backdrop-blur-xl shadow-lg rounded-t-xl md:hidden">
      <Link
        href={"/"}
        className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full py-1 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined" data-icon="search">
          <IoMdSearch className="scale-14" />
        </span>
        <span className="font-label-sm text-label-sm mt-1">Search</span>
      </Link>
      <Link
        href={"/favorites"}
        className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined" data-icon="favorite">
          <FaRegHeart className="scale-13" />
        </span>
        <span className="font-label-sm text-label-sm mt-1">Favorites</span>
      </Link>
      <Link
        href={"/recent"}
        className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined" data-icon="history">
          <MdHistory className="scale-14" />
        </span>
        <span className="font-label-sm text-label-sm mt-1">Recent</span>
      </Link>
      <Link
        href={"/profile"}
        className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined" data-icon="person">
          <MdOutlinePerson2 className="scale-14" />
        </span>
        <span className="font-label-sm text-label-sm mt-1">Profile</span>
      </Link>
    </nav>
  );
};
