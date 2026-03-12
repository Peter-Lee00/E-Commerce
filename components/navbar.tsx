"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const { items } = useCartStore();
  const { theme, setTheme } = useTheme();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // hydration 방지
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 shadow dark:shadow-zinc-800 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold hover:opacity-70 transition-opacity">
          My Ecommerce By Lee
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
          <Link href="/products" className="hover:opacity-70 transition-opacity">Products</Link>
          <Link href="/checkout" className="hover:opacity-70 transition-opacity">Checkout</Link>
        </div>

        <div className="flex items-center space-x-3">
          {/* 다크모드 토글 */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <SunIcon className="h-4 w-4 text-yellow-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}

          {/* 장바구니 */}
          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 shadow-md transition-colors">
          <ul className="flex flex-col p-4 space-y-2">
            <li><Link href="/" className="block hover:opacity-70">Home</Link></li>
            <li><Link href="/products" className="block hover:opacity-70">Products</Link></li>
            <li><Link href="/checkout" className="block hover:opacity-70">Checkout</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};
