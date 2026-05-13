"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CityMarker, Encounter, EncounterDetail, EncounterVersionDetail } from "@/types/pokemon";
import { fetchLocationEncounters } from "@/api/pokemon";
import { getTypeColorClass } from "@/utils/colors";

interface LocationSidebarProps {
  city: CityMarker;
  onClose?: () => void;
}

interface ProcessedEncounter {
  pokemonId: number;
  pokemonName: string;
  imageUrl: string;
  levels: string;
  methods: string[];
  versions: string[];
  rarity: number;
}

function processEncounters(encounters: Encounter[]): ProcessedEncounter[] {
  const grouped = new Map<string, ProcessedEncounter>();

  for (const encounter of encounters) {
    const id = encounter.pokemon.url.split("/").slice(-2, -1)[0];
    const name = encounter.pokemon.name;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    if (grouped.has(name)) {
      const existing = grouped.get(name)!;
      for (const vd of encounter.version_details) {
        if (!existing.versions.includes(vd.version.name)) {
          existing.versions.push(vd.version.name);
        }
        existing.rarity += vd.max_chance;
      }
    } else {
      const levels = new Set<string>();
      const methods = new Set<string>();

      for (const vd of encounter.version_details) {
        for (const detail of vd.encounter_details) {
          if (detail.min_level === detail.max_level) {
            levels.add(`Lvl ${detail.min_level}`);
          } else {
            levels.add(`Lvl ${detail.min_level}-${detail.max_level}`);
          }
          methods.add(detail.method.name.replace("-", " "));
        }
      }

      const versions = [...new Set(encounter.version_details.map((vd) => vd.version.name))];
      const rarity = Math.max(...encounter.version_details.map((vd) => vd.max_chance));

      grouped.set(name, {
        pokemonId: parseInt(id),
        pokemonName: name,
        imageUrl,
        levels: [...levels].join(", "),
        methods: [...methods],
        versions,
        rarity,
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => a.pokemonId - b.pokemonId);
}

export default function LocationSidebar({ city, onClose }: LocationSidebarProps) {
  const { data: encounters, isLoading, error } = useQuery({
    queryKey: ["location-encounters", city.locationId],
    queryFn: () => fetchLocationEncounters(city.locationId),
  });

  const processedEncounters = encounters ? processEncounters(encounters) : [];

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white capitalize">{city.name}</h2>
          <p className="text-white/50 text-xs">Wild encounters</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin border-4 border-white/20 border-t-white rounded-full w-8 h-8"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-white/50 text-sm">No Pokemon found at this location</p>
          </div>
        ) : processedEncounters.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-white/50 text-sm">No encounter data available</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {processedEncounters.map((encounter) => (
              <Link
                key={encounter.pokemonName}
                href={`/pokemon/${encounter.pokemonId}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                {/* Pokemon Image */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={encounter.imageUrl}
                    alt={encounter.pokemonName}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium capitalize truncate">
                    {encounter.pokemonName}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded">
                      {encounter.levels}
                    </span>
                    {encounter.methods.map((method) => (
                      <span
                        key={method}
                        className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded capitalize"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rarity indicator */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      encounter.rarity > 50
                        ? "bg-yellow-400"
                        : encounter.rarity > 20
                        ? "bg-green-400"
                        : "bg-white/30"
                    }`}
                    title={`Rarity: ${encounter.rarity}%`}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <p className="text-white/30 text-xs text-center">
          {processedEncounters.length} Pokemon found
        </p>
      </div>
    </div>
  );
}