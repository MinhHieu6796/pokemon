"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { fetchPokemonSpecies, fetchEvolutionChain, extractIdFromUrl } from "@/api/pokemon";
import { ChainLink, EvolutionDetail } from "@/types/pokemon";

interface EvolutionChainProps {
  pokemonId: number;
}

// Format the evolution condition to text
const formatEvolutionDetails = (details: EvolutionDetail[]) => {
  if (!details || details.length === 0) return null;
  const detail = details[0]; // Usually only one valid condition

  const conditions = [];

  if (detail.min_level) conditions.push(`Lvl ${detail.min_level}`);
  if (detail.item) conditions.push(`Use ${detail.item.name.replace('-', ' ')}`);
  if (detail.trigger?.name === 'trade') conditions.push('Trade');
  if (detail.min_happiness) conditions.push(`Happiness ${detail.min_happiness}`);
  if (detail.time_of_day) conditions.push(detail.time_of_day === 'day' ? 'Daytime' : 'Nighttime');
  if (detail.known_move) conditions.push(`Knows ${detail.known_move.name.replace('-', ' ')}`);
  if (detail.location) conditions.push(`At ${detail.location.name.replace('-', ' ')}`);

  if (conditions.length === 0 && detail.trigger?.name) {
    return detail.trigger.name.replace('-', ' ');
  }

  return conditions.join(' + ');
};

const EvolutionNode = ({ chain }: { chain: ChainLink }) => {
  const speciesId = extractIdFromUrl(chain.species.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* Current Pokemon */}
      <Link href={`/pokemon/${speciesId}`} className="group flex flex-col items-center">
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full border border-white/10 group-hover:border-white/40 transition-colors p-2 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={chain.species.name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform"
          />
        </div>
        <p className="text-white mt-2 font-medium capitalize">{chain.species.name}</p>
      </Link>

      {/* Evolutions */}
      {chain.evolves_to.length > 0 && (
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          {chain.evolves_to.map((evolution, index) => (
            <div key={evolution.species.name} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              {/* Arrow and Condition */}
              <div className="flex flex-col items-center justify-center text-white/50">
                <span className="text-xs mb-1 px-2 py-1 bg-white/10 rounded-md whitespace-nowrap text-center text-white/80">
                  {formatEvolutionDetails(evolution.evolution_details) || '?'}
                </span>
                {/* Arrow (Down on mobile, Right on desktop) */}
                <svg className="w-6 h-6 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              {/* Next Pokemon recursively */}
              <EvolutionNode chain={evolution} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EvolutionChain({ pokemonId }: EvolutionChainProps) {
  const { data: chainData, isLoading, error } = useQuery({
    queryKey: ["evolution-chain", pokemonId],
    queryFn: async () => {
      const species = await fetchPokemonSpecies(pokemonId);
      if (!species.evolution_chain?.url) throw new Error("No evolution chain found");
      const chain = await fetchEvolutionChain(species.evolution_chain.url);
      return chain;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex justify-center items-center min-h-[200px]">
        <div className="animate-spin border-4 border-white/30 border-t-white rounded-full w-8 h-8"></div>
      </div>
    );
  }

  if (error || !chainData) {
    return null; // Silent fail if no evolution data
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl overflow-x-auto">
      <h3 className="text-xl font-bold text-white mb-6">Evolution Chain</h3>
      <div className="flex justify-start md:justify-center min-w-max pb-4">
        <EvolutionNode chain={chainData.chain} />
      </div>
    </div>
  );
}
