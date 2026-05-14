"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CityMarker, RegionMapData } from "@/types/pokemon";
import { allRegionMaps, regionColors } from "@/data/maps";
import RegionMap from "@/components/map/RegionMap";
import LocationSidebar from "@/components/map/LocationSidebar";

const queryClient = new QueryClient();

// Region display info
const regionInfo = {
  kanto: { name: "Kanto", color: "bg-red-500", generation: "Gen I", year: 1996 },
  johto: { name: "Johto", color: "bg-amber-500", generation: "Gen II", year: 1999 },
  hoenn: { name: "Hoenn", color: "bg-emerald-500", generation: "Gen III", year: 2002 },
  sinnoh: { name: "Sinnoh", color: "bg-indigo-500", generation: "Gen IV", year: 2006 },
  unova: { name: "Unova", color: "bg-violet-500", generation: "Gen V", year: 2010 },
};

type RegionKey = keyof typeof allRegionMaps;

export default function MapsPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("kanto");
  const [selectedCity, setSelectedCity] = useState<CityMarker | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const currentMapData = allRegionMaps[selectedRegion] as RegionMapData;
  const colors = regionColors[selectedRegion];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Pokemon Region Maps</h1>
            <p className="text-white/50">
              Explore Pokemon locations across different regions. Click on a city to see wild encounters.
            </p>
          </div>

          {/* Region Selector */}
          <div className="mb-6 flex flex-wrap gap-2">
            {(Object.keys(allRegionMaps) as RegionKey[]).map((regionKey) => {
              const info = regionInfo[regionKey];
              const isActive = selectedRegion === regionKey;
              const regionColor = regionColors[regionKey];

              return (
                <button
                  key={regionKey}
                  onClick={() => {
                    setSelectedRegion(regionKey);
                    setSelectedCity(null);
                  }}
                  className={`
                    relative px-4 py-2 rounded-xl font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-xl blur-md opacity-50"
                      style={{ backgroundColor: regionColor.primary }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {info.name}
                    <span className="text-xs opacity-50">{info.generation}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-4">
            {/* Map Container */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                {/* Region Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: colors.accent + "30" }}
                    >
                      🗺️
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {currentMapData.regionName} Region
                      </h2>
                      <p className="text-white/50 text-sm">
                        {currentMapData.cities.length} locations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="relative h-[500px] md:h-[600px]">
                  <RegionMap
                    mapData={currentMapData}
                    onCityClick={setSelectedCity}
                    selectedCity={selectedCity?.name}
                    hoveredCity={hoveredCity ?? undefined}
                    onCityHover={setHoveredCity}
                  />
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-6 text-white/50 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/40"></div>
                      <span>City / Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-white/20"></div>
                      <span>Route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      ></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              {selectedCity ? (
                <div className="sticky top-6">
                  <LocationSidebar
                    city={selectedCity}
                    onClose={() => setSelectedCity(null)}
                  />
                </div>
              ) : (
                <div className="h-full min-h-[400px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Select a Location
                  </h3>
                  <p className="text-white/50 text-sm">
                    Click on a city marker on the map to view wild Pokemon encounters in that area.
                  </p>

                  {/* Popular locations quick access */}
                  <div className="mt-6 w-full">
                    <p className="text-white/30 text-xs mb-3 uppercase tracking-wider">
                      Popular Locations
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentMapData.cities.slice(0, 5).map((city) => (
                        <button
                          key={city.name}
                          onClick={() => setSelectedCity(city)}
                          className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Region Info Cards */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(allRegionMaps) as RegionKey[]).map((regionKey) => {
              const info = regionInfo[regionKey];
              const regionColor = regionColors[regionKey];
              const regionMap = allRegionMaps[regionKey];

              return (
                <button
                  key={regionKey}
                  onClick={() => {
                    setSelectedRegion(regionKey);
                    setSelectedCity(null);
                  }}
                  className={`
                    p-4 rounded-xl bg-white/5 border transition-all duration-200
                    hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]
                    ${
                      selectedRegion === regionKey
                        ? "border-white/30"
                        : "border-white/10"
                    }
                  `}
                  style={{
                    borderColor:
                      selectedRegion === regionKey
                        ? regionColor.primary + "50"
                        : undefined,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-lg"
                    style={{ backgroundColor: regionColor.accent + "30" }}
                  >
                    🏔️
                  </div>
                  <h4 className="font-semibold text-white">{info.name}</h4>
                  <p className="text-white/50 text-xs mt-1">{info.generation}</p>
                  <p className="text-white/30 text-xs">
                    {regionMap.cities.length} locations
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}