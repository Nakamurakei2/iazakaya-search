"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";

export function HeaderLoggedOut() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * ログインボタン押下時処理
   */
  const handleLogin = () => {
    router.push("/login");
  };

  /**
   * 登録ボタン押下時処理
   */
  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-container-margin py-xs bg-surface/80 dark:bg-surface/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-sm">
          <button className="text-primary hover:bg-surface-variant/50 transition-all duration-300 active:scale-95 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined" data-icon="location_on">
              <CiLocationOn />
            </span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            Izakaya Finder
          </h1>
        </div>
        <div className="flex items-center">
          <button className="hover:bg-surface-variant/50 transition-all duration-300 active:scale-95 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">
              <IoPersonCircleOutline />
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
