import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Pokédex",
  description: "Login to your Pokédex account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
