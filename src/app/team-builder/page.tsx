"use client";

import { useCallback, useEffect } from "react";
import { useTeam } from "@/hooks/useTeam";
import { useCounterTeam } from "@/hooks/useCounterTeam";
import TeamBuilderLayout from "@/components/team-builder/TeamBuilderLayout";
import { TeamPokemon } from "@/types/team";

export default function TeamBuilderPage() {
  const { slots, analysis, addPokemon, removePokemon, swapPokemon, clearTeam, isHydrated } = useTeam();
  const { result, isLoading, findCounters, clear } = useCounterTeam();

  const handleDragStart = useCallback((e: React.DragEvent, pokemon: TeamPokemon) => {
    e.dataTransfer.setData("application/json", JSON.stringify(pokemon));
    e.dataTransfer.setData("source", "picker");
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  // Clear counter team when the user's team changes
  useEffect(() => {
    clear();
  }, [slots, clear]);

  const handleFindCounters = useCallback(() => {
    const active = slots.filter((s): s is TeamPokemon => s !== null);
    if (active.length >= 3) {
      findCounters(active);
    }
  }, [slots, findCounters]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white/50">Loading team builder...</div>
      </div>
    );
  }

  return (
    <TeamBuilderLayout
      slots={slots}
      analysis={analysis}
      counterResult={result}
      isCounterLoading={isLoading}
      onAddPokemon={addPokemon}
      onRemovePokemon={removePokemon}
      onSwapPokemon={swapPokemon}
      onClearTeam={clearTeam}
      onDragStart={handleDragStart}
      onFindCounters={handleFindCounters}
      onClearCounter={clear}
    />
  );
}
