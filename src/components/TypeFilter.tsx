"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { typeColors } from "@/utils/colors";

interface TypeFilterProps {
  types: string[];
}

export default function TypeFilter({ types }: TypeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedTypes = searchParams.get("type")?.split(",").filter(Boolean) || [];
  const isAllSelected = selectedTypes.length === 0;

  const handleTypeClick = (type: string) => {
    let newTypes = [...selectedTypes];

    if (newTypes.includes(type)) {
      newTypes = newTypes.filter((t) => t !== type);
    } else {
      newTypes.push(type);
    }
    const params = new URLSearchParams(searchParams.toString());

    if (newTypes.length > 0) {
      params.set("type", newTypes.join(","));
    } else {
      params.delete("type");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm min-h-6">
        <div className="text-white/50">
          Selected: <span className="text-white font-medium">{selectedTypes.length}</span>
          {selectedTypes.length > 1 && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-300 font-medium">
              Multi-type filter
            </span>
          )}
        </div>
        {!isAllSelected && (
          <button
            onClick={clearFilters}
            className="text-white/50 hover:text-white transition-colors">
            Clear specific filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={clearFilters}
          className={`
            relative overflow-hidden
            px-4 py-2 rounded-xl text-sm font-semibold capitalize
            border border-white/10 shadow-lg backdrop-blur-md
            transition-all duration-300 transform active:scale-95
            ${
              isAllSelected
                ? "bg-white text-black shadow-white/20 border-white/30"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }
          `}>
          {isAllSelected && <div className="absolute inset-0 bg-white opacity-20" />}
          <span className="relative z-10 flex items-center justify-center">All Types</span>
        </button>

        {types.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const colors = typeColors[type as keyof typeof typeColors] || {
            light: "#A8A878",
            medium: "#8A8A59",
          };

          return (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`
                group relative overflow-hidden
                px-4 py-2 rounded-xl text-sm font-semibold capitalize
                border shadow-lg backdrop-blur-md
                transition-all duration-300 transform active:scale-95
                ${
                  isSelected
                    ? "text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] border-white/30 scale-105"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
                }
              `}
              title={`Filter by ${type} type`}>
              {isSelected && (
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${colors.light}, ${colors.medium})`,
                  }}
                />
              )}
              {isSelected && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: "white" }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className={isSelected ? "drop-shadow-md" : ""}>{type}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
