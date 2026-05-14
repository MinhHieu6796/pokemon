"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import PokemonListItem from "./PokemonListItem";
import { TeamPokemon } from "@/types/team";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

interface PokemonPickerProps {
  onDragStart: (e: React.DragEvent, pokemon: TeamPokemon) => void;
}

interface PokeApiResult {
  name: string;
  url: string;
}

function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

const ITEMS_PER_PAGE = 20;

export default function PokemonPicker({ onDragStart }: PokemonPickerProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: async () => {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error("Failed to fetch Pokemon list");
      const json = await res.json();

      // Fetch details for each pokemon on this page
      const detailPromises = json.results.map((r: PokeApiResult) =>
        fetch(r.url).then((res) => res.json())
      );
      const details = await Promise.all(detailPromises);
      const pokemon: TeamPokemon[] = details.map((d: Record<string, unknown>) => ({
        id: d.id as number,
        name: d.name as string,
        image: (d.sprites as Record<string, Record<string, Record<string, string | null> | undefined> | undefined>)?.other?.["official-artwork"]?.front_default ??
               (d.sprites as Record<string, string | null> | undefined)?.front_default ??
               getSpriteUrl(d.id as number),
        types: ((d.types as { type: { name: string } }[]) || []).map((t) => t.type.name),
        stats: ((d.stats as { base_stat: number; stat: { name: string } }[]) || []).map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      }));

      return { pokemon, total: json.count as number };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const filtered = useMemo(() => {
    if (!data?.pokemon) return [];
    if (!search.trim()) return data.pokemon;
    const query = search.toLowerCase().trim();
    return data.pokemon.filter((p) => p.name.includes(query));
  }, [data?.pokemon, search]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  }, []);

  const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search Pokémon by name..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Compact List */}
      <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-white/40">
            <p className="text-lg">No Pokémon found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          filtered.map((pokemon) => (
            <PokemonListItem
              key={pokemon.id}
              pokemon={pokemon}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !search && (
        <div className="flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <span className="text-sm text-white/50">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
