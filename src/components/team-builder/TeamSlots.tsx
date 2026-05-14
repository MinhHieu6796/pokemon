"use client";

import { useState } from "react";
import TeamSlot from "./TeamSlot";
import { TeamPokemon } from "@/types/team";

interface TeamSlotsProps {
  slots: (TeamPokemon | null)[];
  onAddPokemon: (index: number, pokemon: TeamPokemon) => void;
  onRemovePokemon: (index: number) => void;
  onSwapPokemon: (from: number, to: number) => void;
}

export default function TeamSlots({
  slots,
  onAddPokemon,
  onRemovePokemon,
  onSwapPokemon,
}: TeamSlotsProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    const source = e.dataTransfer.getData("source");
    const data = e.dataTransfer.getData("application/json");

    if (source === "slot") {
      const fromIndex = parseInt(e.dataTransfer.getData("sourceIndex"));
      if (fromIndex !== index && slots[fromIndex] && slots[index]) {
        onSwapPokemon(fromIndex, index);
      } else if (fromIndex !== index && slots[fromIndex] && !slots[index]) {
        onSwapPokemon(fromIndex, index);
      }
    } else if (source === "picker" && data) {
      try {
        const pokemon = JSON.parse(data) as TeamPokemon;
        onAddPokemon(index, pokemon);
      } catch {
        // ignore
      }
    }

    setDragSourceIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = dragSourceIndex !== null ? "move" : "copy";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleSlotDragStart = (e: React.DragEvent, index: number) => {
    if (slots[index]) {
      e.dataTransfer.setData("source", "slot");
      e.dataTransfer.setData("sourceIndex", index.toString());
      e.dataTransfer.setData("application/json", JSON.stringify(slots[index]));
      e.dataTransfer.effectAllowed = "move";
      setDragSourceIndex(index);
    }
  };

  const count = slots.filter((s) => s !== null).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Your Team</h2>
        <span className="text-sm text-white/50">{count}/6</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {slots.map((pokemon, index) => (
          <TeamSlot
            key={index}
            index={index}
            pokemon={pokemon}
            isDragOver={dragOverIndex === index}
            onDrop={handleDrop}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onRemove={onRemovePokemon}
            onSlotDragStart={handleSlotDragStart}
          />
        ))}
      </div>
    </div>
  );
}
