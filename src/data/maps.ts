"use client";

import { CityMarker } from "@/types/pokemon";

// Kanto region map data with approximate positions
export const kantoMapData = {
  regionName: "Kanto",
  cities: [
    { name: "Pallet Town", x: 15, y: 85, locationId: "pallet-town" },
    { name: "Viridian City", x: 28, y: 70, locationId: "viridian-city" },
    { name: "Pewter City", x: 35, y: 45, locationId: "pewter-city" },
    { name: "Cerulean City", x: 28, y: 35, locationId: "cerulean-city" },
    { name: "Lavender Town", x: 55, y: 40, locationId: "lavender-town" },
    { name: "Vermilion City", x: 70, y: 55, locationId: "vermilion-city" },
    { name: "Celadon City", x: 50, y: 55, locationId: "celadon-city" },
    { name: "Saffron City", x: 42, y: 55, locationId: "saffron-city" },
    { name: "Fuchsia City", x: 65, y: 75, locationId: "fuchsia-city" },
    { name: "Cinnabar Island", x: 85, y: 55, locationId: "cinnabar-island" },
    { name: "Indigo Plateau", x: 20, y: 20, locationId: "indigo-plateau" },
  ],
  paths: [
    { from: "Pallet Town", to: "Viridian City" },
    { from: "Viridian City", to: "Pewter City" },
    { from: "Pewter City", to: "Cerulean City" },
    { from: "Cerulean City", to: "Lavender Town" },
    { from: "Cerulean City", to: "Vermilion City" },
    { from: "Lavender Town", to: "Saffron City" },
    { from: "Vermilion City", to: "Celadon City" },
    { from: "Celadon City", to: "Saffron City" },
    { from: "Saffron City", to: "Fuchsia City" },
    { from: "Vermilion City", to: "Fuchsia City" },
  ],
};

// Johto region map data
export const johtoMapData = {
  regionName: "Johto",
  cities: [
    { name: "New Bark Town", x: 20, y: 85, locationId: "new-bark-town" },
    { name: "Cherrygrove City", x: 35, y: 80, locationId: "cherrygrove-city" },
    { name: "Violet City", x: 50, y: 65, locationId: "violet-city" },
    { name: "Azalea Town", x: 40, y: 50, locationId: "azalea-town" },
    { name: "Goldenrod City", x: 55, y: 50, locationId: "goldenrod-city" },
    { name: "Ecruteak City", x: 70, y: 45, locationId: "ecruteak-city" },
    { name: "Olivine City", x: 80, y: 60, locationId: "olivine-city" },
    { name: "Cianwood City", x: 90, y: 50, locationId: "cianwood-city" },
    { name: "Mahogany Town", x: 75, y: 30, locationId: "mahogany-town" },
    { name: "Lake of Rage", x: 85, y: 25, locationId: "lake-of-rage" },
    { name: "Blackthorn City", x: 85, y: 15, locationId: "blackthorn-city" },
  ],
  paths: [
    { from: "New Bark Town", to: "Cherrygrove City" },
    { from: "Cherrygrove City", to: "Violet City" },
    { from: "Violet City", to: "Azalea Town" },
    { from: "Azalea Town", to: "Goldenrod City" },
    { from: "Goldenrod City", to: "Ecruteak City" },
    { from: "Goldenrod City", to: "Olivine City" },
    { from: "Ecruteak City", to: "Olivine City" },
    { from: "Ecruteak City", to: "Mahogany Town" },
    { from: "Mahogany Town", to: "Lake of Rage" },
    { from: "Mahogany Town", to: "Blackthorn City" },
  ],
};

// Hoenn region map data
export const hoennMapData = {
  regionName: "Hoenn",
  cities: [
    { name: "Littleroot Town", x: 25, y: 90, locationId: "littleroot-town" },
    { name: "Oldale Town", x: 35, y: 75, locationId: "oldale-town" },
    { name: "Dewford Town", x: 45, y: 60, locationId: "dewford-town" },
    { name: "Lavaridge Town", x: 55, y: 50, locationId: "lavaridge-town" },
    { name: "Fallarbor Town", x: 50, y: 40, locationId: "fallarbor-town" },
    { name: "Verdanturf Town", x: 60, y: 45, locationId: "verdanturf-town" },
    { name: "Mauville City", x: 55, y: 65, locationId: "mauville-city" },
    { name: "Rustboro City", x: 40, y: 45, locationId: "rustboro-city" },
    { name: "Fortree City", x: 65, y: 40, locationId: "fortree-city" },
    { name: "Lilycove City", x: 75, y: 55, locationId: "lilycove-city" },
    { name: "Mossdeep City", x: 85, y: 50, locationId: "mossdeep-city" },
    { name: "Sootopolis City", x: 70, y: 35, locationId: "sootopolis-city" },
    { name: "Pacifidlog Town", x: 85, y: 70, locationId: "pacifidlog-town" },
    { name: "Ever Grande City", x: 88, y: 25, locationId: "ever-grande-city" },
  ],
  paths: [
    { from: "Littleroot Town", to: "Oldale Town" },
    { from: "Oldale Town", to: "Dewford Town" },
    { from: "Oldale Town", to: "Rustboro City" },
    { from: "Dewford Town", to: "Lavaridge Town" },
    { from: "Lavaridge Town", to: "Fallarbor Town" },
    { from: "Lavaridge Town", to: "Verdanturf Town" },
    { from: "Rustboro City", to: "Fallarbor Town" },
    { from: "Rustboro City", to: "Mauville City" },
    { from: "Verdanturf Town", to: "Mauville City" },
    { from: "Fallarbor Town", to: "Fortree City" },
    { from: "Mauville City", to: "Fortree City" },
    { from: "Mauville City", to: "Lilycove City" },
    { from: "Fortree City", to: "Sootopolis City" },
    { from: "Lilycove City", to: "Mossdeep City" },
    { from: "Mossdeep City", to: "Sootopolis City" },
    { from: "Lilycove City", to: "Pacifidlog Town" },
    { from: "Sootopolis City", to: "Ever Grande City" },
  ],
};

// Sinnoh region map data
export const sinnohMapData = {
  regionName: "Sinnoh",
  cities: [
    { name: "Twinleaf Town", x: 30, y: 85, locationId: "twinleaf-town" },
    { name: "Sandgem Town", x: 40, y: 75, locationId: "sandgem-town" },
    { name: "Jubilife City", x: 50, y: 65, locationId: "jubilife-city" },
    { name: "Oreburgh City", x: 35, y: 50, locationId: "oreburgh-city" },
    { name: "Floaroma Town", x: 55, y: 45, locationId: "floaroma-town" },
    { name: "Eterna City", x: 65, y: 40, locationId: "eterna-city" },
    { name: "Hearthome City", x: 50, y: 30, locationId: "hearthome-city" },
    { name: "Solaceon Town", x: 40, y: 25, locationId: "solaceon-town" },
    { name: "Veilstone City", x: 70, y: 30, locationId: "veilstone-city" },
    { name: "Pastoria City", x: 80, y: 45, locationId: "pastoria-city" },
    { name: "Celestic Town", x: 60, y: 20, locationId: "celestic-town" },
    { name: "Canalave City", x: 25, y: 35, locationId: "canalave-city" },
    { name: "Snowpoint City", x: 20, y: 15, locationId: "snowpoint-city" },
    { name: "Sunyshore City", x: 85, y: 25, locationId: "sunyshore-city" },
    { name: "Pokemon League", x: 25, y: 10, locationId: "pokemon-league-sinnoh" },
  ],
  paths: [
    { from: "Twinleaf Town", to: "Sandgem Town" },
    { from: "Sandgem Town", to: "Jubilife City" },
    { from: "Jubilife City", to: "Oreburgh City" },
    { from: "Jubilife City", to: "Floaroma Town" },
    { from: "Oreburgh City", to: "Eterna City" },
    { from: "Floaroma Town", to: "Eterna City" },
    { from: "Eterna City", to: "Hearthome City" },
    { from: "Hearthome City", to: "Solaceon Town" },
    { from: "Hearthome City", to: "Veilstone City" },
    { from: "Hearthome City", to: "Pastoria City" },
    { from: "Solaceon Town", to: "Celestic Town" },
    { from: "Veilstone City", to: "Pastoria City" },
    { from: "Solaceon Town", to: "Canalave City" },
    { from: "Canalave City", to: "Snowpoint City" },
    { from: "Veilstone City", to: "Sunyshore City" },
    { from: "Celestic Town", to: "Sunyshore City" },
    { from: "Snowpoint City", to: "Pokemon League" },
  ],
};

// Unova region map data
export const unovaMapData = {
  regionName: "Unova",
  cities: [
    { name: "Nuvema Town", x: 50, y: 90, locationId: "nuvema-town" },
    { name: "Accumula Town", x: 40, y: 75, locationId: "accumula-town" },
    { name: "Striaton City", x: 55, y: 65, locationId: "striaton-city" },
    { name: "Nacrene City", x: 65, y: 55, locationId: "nacrene-city" },
    { name: "Castelia City", x: 80, y: 50, locationId: "castelia-city" },
    { name: "Nimbasa City", x: 70, y: 40, locationId: "nimbasa-city" },
    { name: "Driftveil City", x: 60, y: 35, locationId: "driftveil-city" },
    { name: "Mistralton City", x: 50, y: 25, locationId: "mistralton-city" },
    { name: "Clay Tunnel", x: 45, y: 30, locationId: "relic-castle" },
    { name: "Icirrus City", x: 35, y: 20, locationId: "icirrus-city" },
    { name: " Opelucid City", x: 25, y: 25, locationId: "opelucid-city" },
    { name: " Lacunosa Town", x: 30, y: 15, locationId: "lacunosa-town" },
    { name: "Undella Town", x: 20, y: 35, locationId: "undella-town" },
    { name: "Humilau City", x: 15, y: 50, locationId: "humilau-city" },
    { name: "Victory Road", x: 40, y: 10, locationId: "victory-road-unova" },
  ],
  paths: [
    { from: "Nuvema Town", to: "Accumula Town" },
    { from: "Accumula Town", to: "Striaton City" },
    { from: "Striaton City", to: "Nacrene City" },
    { from: "Nacrene City", to: "Castelia City" },
    { from: "Nacrene City", to: "Nimbasa City" },
    { from: "Nimbasa City", to: "Driftveil City" },
    { from: "Driftveil City", to: "Mistralton City" },
    { from: "Driftveil City", to: "Icirrus City" },
    { from: "Mistralton City", to: "Clay Tunnel" },
    { from: "Icirrus City", to: "Opelucid City" },
    { from: "Icirrus City", to: "Lacunosa Town" },
    { from: "Opelucid City", to: "Undella Town" },
    { from: "Undella Town", to: "Humilau City" },
    { from: "Lacunosa Town", to: "Victory Road" },
    { from: "Humilau City", to: "Victory Road" },
  ],
};

// Combine all regions
export const allRegionMaps = {
  kanto: kantoMapData,
  johto: johtoMapData,
  hoenn: hoennMapData,
  sinnoh: sinnohMapData,
  unova: unovaMapData,
};

// Get city by name
export function getCityByName(regionName: string, cityName: string): CityMarker | undefined {
  const regionMap = allRegionMaps[regionName as keyof typeof allRegionMaps];
  return regionMap?.cities.find(c => c.name === cityName);
}

// Get region colors
export const regionColors: Record<string, { primary: string; secondary: string; accent: string }> = {
  kanto: { primary: "#EF4444", secondary: "#FCA5A5", accent: "#FEE2E2" },
  johto: { primary: "#F59E0B", secondary: "#FCD34D", accent: "#FEF3C7" },
  hoenn: { primary: "#10B981", secondary: "#6EE7B7", accent: "#D1FAE5" },
  sinnoh: { primary: "#6366F1", secondary: "#A5B4FC", accent: "#E0E7FF" },
  unova: { primary: "#8B5CF6", secondary: "#C4B5FD", accent: "#EDE9FE" },
};