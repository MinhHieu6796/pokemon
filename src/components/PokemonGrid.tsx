import { PokemonCardData } from "@/types/pokemon";
import PokemonCard from "./PokemonCard";

interface PokemonGridProps {
  pokemon: PokemonCardData[];
}

export default function PokemonGrid({ pokemon }: PokemonGridProps) {
  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white/70">No Pokémon found</h3>
        <p className="text-sm text-white/40 mt-2">
          Try changing the type filter or navigating to a different page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
}
