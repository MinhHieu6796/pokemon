import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pokédex - Explore All Pokémon",
  description:
    "Browse and discover Pokémon with detailed stats, types, and abilities. Filter by type and explore the complete Pokédex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-[#0f0f23] text-white min-h-screen`}>
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        </div>
        <main className="relative z-0">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
