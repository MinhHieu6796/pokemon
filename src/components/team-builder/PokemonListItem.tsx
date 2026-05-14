import Image from "next/image";
import { TYPE_COLORS } from "@/utils/constants";
import { TeamPokemon } from "@/types/team";

interface PokemonListItemProps {
  pokemon: TeamPokemon;
  onDragStart: (e: React.DragEvent, pokemon: TeamPokemon) => void;
}

export default function PokemonListItem({ pokemon, onDragStart }: PokemonListItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, pokemon)}
      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      {/* Number */}
      <span className="text-[10px] text-white/25 w-8 text-right flex-shrink-0 font-mono">
        #{String(pokemon.id).padStart(3, "0")}
      </span>

      {/* Image */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          fill
          sizes="40px"
          className="object-contain"
        />
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-white capitalize flex-1 truncate min-w-0">
        {pokemon.name}
      </span>

      {/* Types */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-2 py-0.5 text-[10px] font-semibold rounded-full text-white capitalize"
            style={{ backgroundColor: TYPE_COLORS[type] ?? "#A8A77A" }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
