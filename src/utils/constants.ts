export const ITEMS_PER_PAGE = 20;

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const TYPE_GRADIENTS: Record<string, string> = {
  normal: "from-amber-200 to-amber-400",
  fire: "from-orange-400 to-red-500",
  water: "from-blue-400 to-blue-600",
  electric: "from-yellow-300 to-yellow-500",
  grass: "from-green-400 to-emerald-500",
  ice: "from-cyan-200 to-cyan-400",
  fighting: "from-red-600 to-red-800",
  poison: "from-purple-400 to-purple-600",
  ground: "from-amber-400 to-yellow-700",
  flying: "from-indigo-300 to-violet-400",
  psychic: "from-pink-400 to-pink-600",
  bug: "from-lime-400 to-green-500",
  rock: "from-yellow-600 to-amber-700",
  ghost: "from-purple-600 to-indigo-700",
  dragon: "from-indigo-500 to-violet-700",
  dark: "from-gray-600 to-gray-800",
  steel: "from-gray-300 to-gray-500",
  fairy: "from-pink-300 to-pink-400",
};

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "SPD",
};

export const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-500",
  attack: "bg-orange-500",
  defense: "bg-yellow-500",
  "special-attack": "bg-blue-500",
  "special-defense": "bg-green-500",
  speed: "bg-pink-500",
};
