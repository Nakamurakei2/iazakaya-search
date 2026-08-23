"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <header className="header-main">
      <div className={menuOpen ? "overlay" : ""}></div>
      <div className="header-contents">
        <div className="header__bar">
          <div className="header__actions">
            <div className="header__buttons">
              <button
                type="button"
                className="header__loginButton"
                onClick={handleLogin}
              >
                ログイン
              </button>
              <button
                type="button"
                className="header__signupButton"
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
