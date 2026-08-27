"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// TODO: ルーティング構成に合わせて href を調整してください
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/favorites", label: "お気に入り", icon: Heart },
  { href: "/contact", label: "お問い合わせ", icon: Mail },
];

export default function FooterLoggedIn() {
  const pathname = usePathname();

  return (
    <nav className="footer-nav" aria-label="フッターナビゲーション">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname?.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`footer-nav-item ${
              isActive ? "footer-nav-item--active" : ""
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="footer-nav-icon-wrap">
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              {isActive && (
                <span className="footer-nav-dot" aria-hidden="true" />
              )}
            </span>
            <span className="footer-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
