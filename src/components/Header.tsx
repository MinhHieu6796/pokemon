export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 py-12">
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
          Pokédex
        </h1>
        <p className="text-sm md:text-base text-white/50 font-medium">
          Explore the world of Pokémon
        </p>
      </div>
    </header>
  );
}
