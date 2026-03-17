export default function PokemonCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 animate-pulse">
      <div className="flex items-center justify-center pt-6 pb-10 px-4 bg-white/5">
        <div className="w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="flex flex-col gap-3 p-4 pt-3">
        <div className="h-5 w-24 mx-auto rounded-md bg-white/10" />

        <div className="flex items-center justify-center gap-2">
          <div className="h-6 w-16 rounded-full bg-white/10" />
          <div className="h-6 w-16 rounded-full bg-white/10" />
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-3 rounded bg-white/10" />
              <div className="flex-1 h-1.5 rounded-full bg-white/10" />
              <div className="w-6 h-3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PokemonGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {Array.from({ length: 20 }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  );
}
