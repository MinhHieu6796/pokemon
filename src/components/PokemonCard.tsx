import Image from "next/image";
import Link from "next/link";
import { PokemonCardData } from "@/types/pokemon";
import { TYPE_COLORS, STAT_LABELS, STAT_COLORS } from "@/utils/constants";

interface PokemonCardProps {
  pokemon: PokemonCardData;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryTypeColor = TYPE_COLORS[pokemon.types[0]] ?? "#A8A77A";

  return (
    <Link href={`/pokemon/${pokemon.id}`} className="block cursor-pointer">
      <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-out">
      <div
        className="relative flex items-center justify-center pt-6 pb-10 px-4"
        style={{
          background: `linear-gradient(135deg, ${primaryTypeColor}33, ${primaryTypeColor}11)`,
        }}
      >
        <span className="absolute top-3 right-3 text-xs font-bold text-white/30 group-hover:text-white/50 transition-colors">
          #{String(pokemon.id).padStart(3, "0")}
        </span>

        <div className="relative w-32 h-32 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="128px"
            className="object-contain"
            priority={pokemon.id <= 20}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-3 flex-1">
        <h3 className="text-lg font-bold capitalize text-white tracking-wide text-center">
          {pokemon.name}
        </h3>

        <div className="flex items-center justify-center gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-3 py-1 text-xs font-semibold rounded-full text-white capitalize shadow-sm"
              style={{ backgroundColor: TYPE_COLORS[type] ?? "#A8A77A" }}
            >
              {type}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          {pokemon.stats.slice(0, 6).map((stat) => (
            <div key={stat.name} className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-gray-400 w-7 text-right uppercase">
                {STAT_LABELS[stat.name] ?? stat.name}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${STAT_COLORS[stat.name] ?? "bg-gray-400"} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-500 w-6 text-right">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Link>
  );
}
