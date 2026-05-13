"use client";

import { useState, useMemo } from "react";
import { RegionMapData, CityMarker } from "@/types/pokemon";
import { regionColors } from "@/data/maps";

interface RegionMapProps {
  mapData: RegionMapData;
  onCityClick?: (city: CityMarker) => void;
  selectedCity?: string;
  hoveredCity?: string;
  onCityHover?: (city: string | null) => void;
}

// SVG paths for each region's landmass
const regionShapes: Record<string, string> = {
  kanto: "M 10 85 Q 15 75 20 70 Q 25 65 30 60 Q 35 55 40 50 Q 45 45 50 40 Q 55 35 60 30 Q 65 25 70 20 Q 75 15 80 15 Q 90 15 95 20 Q 98 25 95 30 Q 92 35 88 38 Q 84 42 80 45 Q 76 48 72 52 Q 68 56 64 60 Q 60 64 56 68 Q 52 72 48 76 Q 44 80 40 85 Q 35 90 30 92 Q 22 90 15 88 Q 10 86 10 85",
  johto: "M 8 90 Q 12 80 18 70 Q 25 60 35 50 Q 45 40 55 35 Q 65 30 75 25 Q 85 20 92 18 Q 98 16 98 25 Q 97 35 92 45 Q 87 55 80 60 Q 73 65 65 68 Q 57 72 50 75 Q 43 78 38 82 Q 30 88 20 92 Q 12 93 8 90",
  hoenn: "M 15 95 Q 20 85 30 75 Q 40 65 50 55 Q 60 45 70 40 Q 80 35 90 35 Q 98 35 95 45 Q 92 55 85 60 Q 78 65 70 68 Q 62 72 55 75 Q 48 78 42 82 Q 35 88 28 92 Q 20 95 15 95 M 55 15 Q 60 10 65 12 Q 70 14 68 18 Q 65 22 60 20 Q 55 18 55 15",
  sinnoh: "M 12 85 Q 18 75 25 65 Q 32 55 40 45 Q 48 35 58 30 Q 68 25 78 22 Q 88 20 95 25 Q 98 30 95 38 Q 90 48 82 55 Q 74 62 65 68 Q 56 74 48 80 Q 40 86 30 90 Q 20 92 12 85 M 20 30 Q 25 20 35 15 Q 42 12 45 18 Q 46 25 40 32 Q 32 36 25 35 Q 18 33 20 30",
  unova: "M 5 90 Q 15 75 30 60 Q 45 45 60 35 Q 75 25 90 20 Q 98 18 95 30 Q 92 42 85 55 Q 78 68 65 78 Q 52 88 35 92 Q 18 94 5 90 M 50 10 Q 60 5 70 8 Q 75 15 70 25 Q 62 32 55 28 Q 48 24 50 15 Q 50 10 50 10",
};

// Landmark icons for special locations
const landmarkIcons: Record<string, string> = {
  "Indigo Plateau": "👑",
  "Pokemon League": "🏆",
  "Victory Road": "⭐",
  "Ever Grande City": "⭐",
  "Blackthorn City": "⭐",
  "Pokemon League Sinnoh": "🏆",
};

export default function RegionMap({
  mapData,
  onCityClick,
  selectedCity,
  hoveredCity,
  onCityHover,
}: RegionMapProps) {
  const colors = regionColors[mapData.regionName.toLowerCase()] || regionColors.kanto;
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Get position for a city
  const getCityPos = (name: string) => {
    const city = mapData.cities.find((c) => c.name === name);
    return city ? { x: city.x, y: city.y } : { x: 0, y: 0 };
  };

  // Generate curved path between cities
  const generatePath = (from: string, to: string) => {
    const fromPos = getCityPos(from);
    const toPos = getCityPos(to);

    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const curveOffset = 3;
    const ctrlX = midX + (dy > 0 ? -curveOffset : curveOffset);
    const ctrlY = midY + (dx > 0 ? curveOffset : -curveOffset);

    return `M ${fromPos.x} ${fromPos.y} Q ${ctrlX} ${ctrlY} ${toPos.x} ${toPos.y}`;
  };

  // Calculate map bounds for cities
  const mapBounds = useMemo(() => {
    const xs = mapData.cities.map((c) => c.x);
    const ys = mapData.cities.map((c) => c.y);
    return {
      minX: Math.min(...xs) - 5,
      maxX: Math.max(...xs) + 5,
      minY: Math.min(...ys) - 5,
      maxY: Math.max(...ys) + 5,
    };
  }, [mapData.cities]);

  // Normalize city positions to fit in viewBox
  const normalizeX = (x: number) => {
    const range = mapBounds.maxX - mapBounds.minX;
    return ((x - mapBounds.minX) / range) * 100;
  };

  const normalizeY = (y: number) => {
    const range = mapBounds.maxY - mapBounds.minY;
    return ((y - mapBounds.minY) / range) * 100;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl overflow-hidden">
      {/* Animated Background Stars */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Radial gradient for region background */}
          <radialGradient id={`regionGrad-${mapData.regionName}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.05" />
          </radialGradient>

          {/* Filter for glow effect */}
          <filter id="cityGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Connection line gradient */}
          <linearGradient id={`routeGrad-${mapData.regionName}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.1" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Region landmass with gradient */}
        <path
          d={regionShapes[mapData.regionName.toLowerCase()] || regionShapes.kanto}
          fill={`url(#regionGrad-${mapData.regionName})`}
          stroke={colors.primary}
          strokeWidth="0.3"
          strokeOpacity="0.3"
          className="transition-all duration-500"
        />

        {/* Decorative terrain dots - using deterministic positions */}
        {[
          [15, 20], [25, 35], [35, 15], [45, 45], [55, 25],
          [65, 40], [75, 55], [80, 70], [70, 85], [60, 75],
          [50, 60], [40, 70], [30, 55], [20, 45], [10, 55],
          [85, 25], [90, 45], [5, 70], [12, 85], [92, 65],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.3"
            fill={colors.secondary}
            opacity="0.1"
          />
        ))}
      </svg>

      {/* Routes/Paths between cities */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {mapData.paths?.map((path) => {
          const isPathHighlighted =
            selectedCity === path.from || selectedCity === path.to;

          return (
            <g key={`${path.from}-${path.to}`}>
              {/* Base route line */}
              <path
                d={generatePath(path.from, path.to)}
                fill="none"
                stroke={colors.secondary}
                strokeWidth="0.3"
                strokeLinecap="round"
                opacity="0.2"
                filter={isPathHighlighted ? "url(#pathGlow)" : undefined}
              />

              {/* Highlighted route */}
              {isPathHighlighted && (
                <path
                  d={generatePath(path.from, path.to)}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeDasharray="1,1"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* City Markers */}
      {mapData.cities.map((city) => {
        const isSelected = selectedCity === city.name;
        const isHovered = hoveredCity === city.name;
        const icon = landmarkIcons[city.name];

        return (
          <div
            key={city.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${normalizeX(city.x)}%`, top: `${normalizeY(city.y)}%` }}
            onClick={() => onCityClick?.(city)}
            onMouseEnter={(e) => {
              onCityHover?.(city.name);
              setTooltipPos({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => onCityHover?.(null)}
          >
            <div
              className={`
                relative flex flex-col items-center
                transition-all duration-300
                ${isSelected || isHovered ? "scale-125 z-20" : "scale-100"}
              `}
            >
              {/* Outer pulse ring for selected */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: colors.primary,
                    opacity: 0.3,
                    width: "150%",
                    height: "150%",
                    marginLeft: "-25%",
                    marginTop: "-25%",
                  }}
                />
              )}

              {/* City marker background */}
              <div
                className={`
                  relative flex items-center justify-center
                  w-8 h-8 md:w-10 md:h-10 rounded-full
                  border-2 transition-all duration-300
                  backdrop-blur-sm
                  ${
                    isSelected
                      ? "bg-white border-white shadow-xl"
                      : isHovered
                      ? "bg-white/90 border-white/80 shadow-lg"
                      : "bg-slate-800/90 border-white/50 hover:bg-slate-700/90 hover:border-white/70"
                  }
                `}
                style={{
                  boxShadow: isSelected
                    ? `0 0 20px ${colors.primary}, 0 0 40px ${colors.secondary}`
                    : isHovered
                    ? `0 0 15px ${colors.primary}`
                    : "0 4px 6px rgba(0,0,0,0.3)",
                }}
              >
                {/* Landmark icon or number */}
                {icon ? (
                  <span className="text-sm">{icon}</span>
                ) : (
                  <span
                    className={`
                      text-xs font-bold
                      ${isSelected || isHovered ? "text-slate-900" : "text-white"}
                    `}
                  >
                    {mapData.cities.indexOf(city) + 1}
                  </span>
                )}
              </div>

              {/* City name label */}
              <div
                className={`
                  absolute top-full mt-2 px-2 py-1 rounded-lg
                  text-[9px] md:text-[10px] font-semibold whitespace-nowrap
                  text-center transition-all duration-200
                  ${
                    isSelected
                      ? "bg-white text-slate-900"
                      : isHovered
                      ? "bg-slate-700 text-white"
                      : "bg-slate-800/80 text-white/70"
                  }
                `}
              >
                {city.name}
              </div>
            </div>
          </div>
        );
      })}

      {/* Hover Tooltip */}
      {hoveredCity && (
        <div
          className="fixed z-50 px-4 py-3 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl pointer-events-none"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 50,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <p className="text-white text-sm font-semibold">{hoveredCity}</p>
          </div>
          <p className="text-white/50 text-xs mt-1">
            Click to view wild encounters
          </p>
        </div>
      )}

      {/* Map decorative border */}
      <div className="absolute inset-0 border-2 border-white/5 rounded-2xl pointer-events-none" />
    </div>
  );
}