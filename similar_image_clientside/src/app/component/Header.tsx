"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavbarProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  resetSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  resetSearch,
}) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        theme === "dark" ? "bg-black bg-opacity-80" : "bg-white bg-opacity-80"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <svg
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-white" : "text-blue-600"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span className="font-semibold text-lg">ImageMatch</span>
            </div>
          </Link>
        </motion.div>

        <div className="space-x-6 hidden md:flex">
          <motion.div className="flex space-x-6">
            {[
              { name: "How It Works", href: "/how-it-works" },
              { name: "Features", href: "/features" },
              { name: "API", href: "/api-docs" },
              { name: "Pricing", href: "/pricing" },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.button
                  className={`transition-colors ${
                    theme === "dark"
                      ? "hover:text-gray-300"
                      : "hover:text-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              </Link>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "dark" ? (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button>

          {/* New Search Button (Only visible on search page) */}
          {!isHomePage && resetSearch && (
            <Link href="/">
              <motion.button
                onClick={resetSearch}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Search
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
