"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  const handleCancelReset = () => {
    setIsForgotPasswordOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg animate-[spin_20s_linear_infinite]">
              <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="3" opacity="0.3" />
              <path d="M 2 50 A 48 48 0 0 1 98 50" fill="#EF4444" opacity="0.8" />
              <path d="M 2 50 A 48 48 0 0 0 98 50" fill="white" opacity="0.8" />
              <rect x="2" y="47" width="96" height="6" fill="white" opacity="0.3" />
              <circle cx="50" cy="50" r="14" fill="white" stroke="white" strokeWidth="3" opacity="0.9" />
              <circle cx="50" cy="50" r="8" fill="#1a1a2e" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pokédex
          </h1>
          <p className="text-sm text-white/50 font-medium">Sign in to your account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-400 text-center font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="trainer@pokemon.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white/70">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-400 hover:to-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-5 text-center">
            <button 
              onClick={handleForgotPassword} 
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs font-medium text-white/40 text-center uppercase tracking-wide">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white/40 mb-1">Admin</p>
              <p className="text-white/70">admin@pokemon.com</p>
              <p className="text-white font-mono">admin123</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white/40 mb-1">User</p>
              <p className="text-white/70">user@pokemon.com</p>
              <p className="text-white font-mono">user123</p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-white/40">
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Create one
          </a>
        </p>

        {/* Forgot Password Modal */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-xl">
              <button
                type="button"
                onClick={handleCancelReset}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="mb-6 text-xl font-semibold text-white text-center">Reset Password</h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-white/70">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-blue-400 hover:to-violet-400"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={handleCancelReset}
                  className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm font-medium text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
