"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "お気に入り登録", href: "/favorites" },
  { label: "問い合わせ", href: "/contact" },
];

export function HeaderLoggedIn() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // ログアウト処理
  const handleLogout = async (): Promise<void> => {
    const res = await fetch("/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
    }

    toast.success(data.message);
    // ログイン画面へ遷移
    router.push("/login");
  };

  return (
    <header className="mt-2 fixed top-0 left-0 w-full z-50 flex items-center justify-between px-container-margin py-xs bg-surface/80 dark:bg-surface/80 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-sm">
        <Link
          href={"/"}
          className="text-primary hover:bg-surface-variant/50 transition-all duration-300 active:scale-95 p-2 rounded-full flex items-center justify-center"
        >
          <span className="material-symbols-outlined" data-icon="location_on">
            <CiLocationOn className="scale-13" />
          </span>
        </Link>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">
          Izakaya Finder
        </h1>
      </div>
      <div className="flex items-center">
        <Link
          href={"/profile"}
          className="hover:bg-surface-variant/50 transition-all duration-300 active:scale-95 p-2 rounded-full flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            <IoPersonCircleOutline className="scale-13" />
          </span>
        </Link>
      </div>
    </header>
  );
}
