"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import TypeMatchups from "@/components/TypeMatchups";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PokemonStatsChart from "@/components/stats/PokemonStatsChart";
import PokemonStatsTable from "@/components/stats/PokemonStatsTable";

// Define types for Pokemon data
interface TypeData {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface StatData {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface AbilityData {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

interface SpritesData {
  front_default: string;
  other: {
    "official-artwork": {
      front_default: string;
    };
  };
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: TypeData[];
  stats: StatData[];
  abilities: AbilityData[];
  sprites: SpritesData;
}

// Create a query client for this page
const queryClient = new QueryClient();

export default function PokemonDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Fetch Pokemon data using TanStack Query
  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!res.ok) throw new Error("Failed to fetch Pokemon data");
      return res.json();
    },
  });

  // State for toggling between chart and table view
  const [showChart, setShowChart] = useState(true);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center text-white">
          <div className="mb-4 h-12 w-12 mx-auto animate-spin border-4 border-white/30 border-t-white rounded-full"></div>
          <p className="text-sm text-white/70">Loading Pokemon data...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-white/70 mb-6">{error instanceof Error ? error.message : "Pokemon not found"}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || "normal";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Navigation */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <span>←</span>
            Back to Pokedex
          </button>

          {/* Row 1: Image + Basic Info + Physical + Stats */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Pokemon Image - Compact */}
            <div className="col-span-12 lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl flex flex-col items-center">
              <div className="relative w-full aspect-square mb-3">
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-white/40 text-xs">#{String(pokemon.id).padStart(4, "0")}</p>
            </div>

            {/* Basic Info - Name & Types */}
            <div className="col-span-12 lg:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-white capitalize mb-3">
                {pokemon.name}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {pokemon.types.map((t: TypeData) => (
                  <span
                    key={t.type.name}
                    className="px-3 py-1.5 text-xs font-semibold text-white capitalize rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-white/50 text-[10px] mb-1">HEIGHT</p>
                  <p className="text-white font-semibold text-sm">{pokemon.height / 10} m</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-white/50 text-[10px] mb-1">WEIGHT</p>
                  <p className="text-white font-semibold text-sm">{pokemon.weight / 10} kg</p>
                </div>
              </div>
            </div>

            {/* Base Stats - Full Width */}
            <div className="col-span-12 lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <h3 className="text-base font-semibold text-white mb-4">Combat Power</h3>
              
              {/* Tab Switcher */}
              <div className="mb-4 flex bg-white/5 rounded-xl">
                <button
                  onClick={() => setShowChart(true)}
                  className={`flex-1 px-4 py-2 text-white/70 hover:text-white transition-colors ${
                    showChart ? "bg-white/10" : "bg-transparent"
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setShowChart(false)}
                  className={`flex-1 px-4 py-2 text-white/70 hover:text-white transition-colors ${
                    !showChart ? "bg-white/10" : "bg-transparent"
                  }`}
                >
                  Table
                </button>
              </div>
              
              {/* Stats Visualization */}
              {showChart ? (
                <PokemonStatsChart stats={pokemon.stats} />
              ) : (
                <PokemonStatsTable stats={pokemon.stats} />
              )}
            </div>
          </div>

          {/* Row 2: Abilities + Type Matchups */}
          <div className="grid grid-cols-12 gap-4">
            {/* Abilities Section */}
            <div className="col-span-12 lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <h3 className="text-base font-semibold text-white mb-4">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((a: AbilityData) => (
                  <div
                    key={a.ability.name}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                      a.is_hidden
                        ? "border-yellow-400/30 bg-yellow-400/10"
                        : "border-white/20 bg-white/5"
                    }`}
                  >
                    <span className="text-white text-sm capitalize">{a.ability.name.replace("-", " ")}</span>
                    {a.is_hidden && (
                      <span className="text-yellow-400 text-[10px] bg-yellow-400/20 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Type Matchups Section */}
            <div className="col-span-12 lg:col-span-7">
              <TypeMatchups types={pokemon.types} />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}