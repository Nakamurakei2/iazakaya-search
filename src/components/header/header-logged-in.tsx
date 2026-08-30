"use client";

import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    <header className="header-main">
      <div
        className={menuOpen ? "overlay" : ""}
        onClick={() => {
          setMenuOpen(false);
        }}
      ></div>
      <div className="header-contents">
        <div className="header__bar">
          <div className="header__actions">
            <div className="header__buttons">
              <button
                type="button"
                className="header__logoutButton"
                onClick={handleLogout}
              >
                ログアウト
              </button>
            </div>
            <button
              type="button"
              className="header__menuButton"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.75} />
              ) : (
                <Menu size={20} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="header__drawer" aria-label="メインメニュー">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="header__drawerLink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
