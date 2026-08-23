"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "プロフィール", href: "/profile" },
  { label: "お気に入り登録", href: "/favorites" },
  { label: "問い合わせ", href: "/contact" },
];

export function HeaderLoggedIn() {
  const [menuOpen, setMenuOpen] = useState(false);

  console.log("menuOpen", menuOpen);

  // ログアウト処理
  const handleLogout = async () => {
    const res = await fetch("http://localhost:5000/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log("logout response", data);
  };

  return (
    <header className="header-main">
      <div className={menuOpen ? "overlay" : ""}></div>
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
