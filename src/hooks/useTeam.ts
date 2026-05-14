import { useState, useEffect, useMemo, useCallback } from "react";
import { TeamPokemon, TeamAnalysisResult } from "@/types/team";
import { loadTeam, saveTeam, emptySlots } from "@/utils/storage";
import { analyzeTeam } from "@/utils/teamAnalysis";

const TEAM_SIZE = 6;

interface UseTeamReturn {
  slots: (TeamPokemon | null)[];
  analysis: TeamAnalysisResult | null;
  addPokemon: (index: number, pokemon: TeamPokemon) => void;
  removePokemon: (index: number) => void;
  swapPokemon: (fromIndex: number, toIndex: number) => void;
  clearTeam: () => void;
  isHydrated: boolean;
}

export function useTeam(): UseTeamReturn {
  const [slots, setSlots] = useState<(TeamPokemon | null)[]>(emptySlots());
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadTeam();
    if (saved) {
      const normalized = [...saved.slots];
      while (normalized.length < TEAM_SIZE) normalized.push(null);
      setSlots(normalized.slice(0, TEAM_SIZE));
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveTeam(slots);
    }
  }, [slots, isHydrated]);

  const analysis = useMemo(() => {
    const active = slots.filter((s): s is TeamPokemon => s !== null);
    if (active.length === 0) return null;
    return analyzeTeam(active);
  }, [slots]);

  const addPokemon = useCallback((index: number, pokemon: TeamPokemon) => {
    setSlots((prev) => {
      const next = [...prev];
      // If slot is already occupied, find next empty slot
      if (next[index] !== null) {
        const emptyIndex = next.findIndex((s) => s === null);
        if (emptyIndex === -1) return prev; // team is full
        next[emptyIndex] = pokemon;
      } else {
        next[index] = pokemon;
      }
      return next;
    });
  }, []);

  const removePokemon = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const swapPokemon = useCallback((fromIndex: number, toIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
  }, []);

  const clearTeamFn = useCallback(() => {
    setSlots(emptySlots());
  }, []);

  return {
    slots,
    analysis,
    addPokemon,
    removePokemon,
    swapPokemon,
    clearTeam: clearTeamFn,
    isHydrated,
  };
}
