"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user?: { name: string; email: string } | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      console.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 py-8">
        <div className="w-14 h-14 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg animate-[spin_20s_linear_infinite]">
            <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="3" opacity="0.3" />
            <path
              d="M 2 50 A 48 48 0 0 1 98 50"
              fill="#EF4444"
              opacity="0.8"
            />
            <path
              d="M 2 50 A 48 48 0 0 0 98 50"
              fill="white"
              opacity="0.8"
            />
            <rect x="2" y="47" width="96" height="6" fill="white" opacity="0.3" />
            <circle cx="50" cy="50" r="14" fill="white" stroke="white" strokeWidth="3" opacity="0.9" />
            <circle cx="50" cy="50" r="8" fill="#1a1a2e" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
          <Link href="/" className="hover:opacity-80 transition-opacity">Pokédex</Link>
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 mt-2">
          <Link
            href="/maps"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
          >
            <span>🗺️</span>
            <span>Maps</span>
          </Link>
        </div>

        <p className="text-sm md:text-base text-white/50 font-medium">
          Explore the world of Pokémon
        </p>

        {user && (
          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm text-gray-300">
              Welcome, <span className="font-semibold text-white">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
