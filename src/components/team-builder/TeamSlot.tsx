import Image from "next/image";
import { TYPE_COLORS } from "@/utils/constants";
import { TeamPokemon } from "@/types/team";

interface TeamSlotProps {
  index: number;
  pokemon: TeamPokemon | null;
  isDragOver: boolean;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onRemove: (index: number) => void;
  onSlotDragStart: (e: React.DragEvent, index: number) => void;
}

export default function TeamSlot({
  index,
  pokemon,
  isDragOver,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  onSlotDragStart,
}: TeamSlotProps) {
  if (pokemon) {
    const primaryTypeColor = TYPE_COLORS[pokemon.types[0]] ?? "#A8A77A";

    return (
      <div
        draggable
        onDragStart={(e) => onSlotDragStart(e, index)}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, index)}
        className={`relative flex flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-200 ${
          isDragOver
            ? "border-white/40 bg-white/10 scale-[1.02] shadow-white/20"
            : "border-white/10 bg-white/5 backdrop-blur-md"
        }`}
      >
        {/* Remove button */}
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/40 flex items-center justify-center transition-colors"
          title="Remove from team"
        >
          ✕
        </button>

        <div
          className="relative flex items-center justify-center pt-6 pb-4 px-4"
          style={{
            background: `linear-gradient(135deg, ${primaryTypeColor}33, ${primaryTypeColor}11)`,
          }}
        >
          <div className="relative w-24 h-24 drop-shadow-lg">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              fill
              sizes="96px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/30">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
            <span className="text-xs text-white/40 cursor-grab active:cursor-grabbing">
              ⠿ drag to swap
            </span>
          </div>
          <h3 className="text-base font-bold capitalize text-white text-center">
            {pokemon.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full text-white capitalize"
                style={{ backgroundColor: TYPE_COLORS[type] ?? "#A8A77A" }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 min-h-[180px] ${
        isDragOver
          ? "border-white/40 bg-white/10 scale-[1.02]"
          : "border-white/20 bg-white/5"
      }`}
    >
      <div className="text-3xl text-white/30 mb-2">+</div>
      <p className="text-sm text-white/40">Drop Pokémon here</p>
      <p className="text-xs text-white/20 mt-1">Slot {index + 1}</p>
    </div>
  );
}
