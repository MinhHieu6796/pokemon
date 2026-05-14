import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Builder - Pokédex",
  description: "Build and analyze your Pokémon team with type coverage, synergy scoring, and counter suggestions.",
};

export default function TeamBuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
