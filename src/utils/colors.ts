export const typeColors: Record<string, { light: string; medium: string }> = {
  normal: { light: "#C6C6A7", medium: "#A8A77A" },
  fire: { light: "#F5AC78", medium: "#EE8130" },
  water: { light: "#9DB7F5", medium: "#6390F0" },
  electric: { light: "#FAE078", medium: "#F7D02C" },
  grass: { light: "#A7DB8D", medium: "#7AC74C" },
  ice: { light: "#BCE6E6", medium: "#96D9D6" },
  fighting: { light: "#D67873", medium: "#C22E28" },
  poison: { light: "#C183C1", medium: "#A33EA1" },
  ground: { light: "#EBD69D", medium: "#E2BF65" },
  flying: { light: "#C6B7F5", medium: "#A98FF3" },
  psychic: { light: "#FA92B2", medium: "#F95587" },
  bug: { light: "#C6D16E", medium: "#A6B91A" },
  rock: { light: "#D1C17D", medium: "#B6A136" },
  ghost: { light: "#A292BC", medium: "#735797" },
  dragon: { light: "#A27DFA", medium: "#6F35FC" },
  dark: { light: "#A29288", medium: "#705746" },
  steel: { light: "#D1D1E0", medium: "#B7B7CE" },
  fairy: { light: "#F4BDC9", medium: "#D685AD" },
};

export function getTypeColorClass(type: string): string {
  const colors = typeColors[type.toLowerCase()];
  return colors ? colors.medium : "#888888";
}

