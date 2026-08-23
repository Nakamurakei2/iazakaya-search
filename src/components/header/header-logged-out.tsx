"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export function HeaderLoggedOut() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    console.log("login process");
  };

  const handleSignup = () => {
    console.log("handleSingup");
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
                onClick={handleLogin}
              >
                ログイン
              </button>

              <button
                type="button"
                className="header__logoutButton"
                onClick={handleSignup}
              >
                登録
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
