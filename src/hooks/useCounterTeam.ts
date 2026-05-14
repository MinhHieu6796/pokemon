import { useState, useCallback } from "react";
import { TeamPokemon } from "@/types/team";
import { CounterTeamResult } from "@/types/counter-team";
import pokemonPool from "@/data/pokemon-pool.json";
import { findCounterTeam } from "@/utils/counterTeam";
import { PoolPokemon } from "@/types/counter-team";

const POOL = pokemonPool as PoolPokemon[];

interface UseCounterTeamReturn {
  result: CounterTeamResult | null;
  isLoading: boolean;
  findCounters: (team: TeamPokemon[]) => void;
  clear: () => void;
}

export function useCounterTeam(): UseCounterTeamReturn {
  const [result, setResult] = useState<CounterTeamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const findCounters = useCallback((team: TeamPokemon[]) => {
    if (team.length < 1) return;

    setIsLoading(true);
    // Run in setTimeout to not block UI
    setTimeout(() => {
      try {
        const counter = findCounterTeam(team, POOL);
        setResult(counter);
      } catch (err) {
        console.error("Failed to find counter team:", err);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, []);

  const clear = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    isLoading,
    findCounters,
    clear,
  };
}
