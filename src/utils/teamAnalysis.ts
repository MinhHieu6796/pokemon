import { TeamPokemon, TeamAnalysisResult } from "@/types/team";

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

// Standard Pokemon type effectiveness chart
// TYPE_CHART[attackingType][defendingType] = multiplier
export const TYPE_CHART: Record<string, Record<string, number>> = {
  normal:   { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  fire:     { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },
  water:    { normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  electric: { normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  grass:    { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },
  ice:      { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1 },
  fighting: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },
  ground:   { normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  flying:   { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  psychic:  { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },
  bug:      { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  ghost:    { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1 },
  dragon:   { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0 },
  dark:     { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5 },
  steel:    { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },
  fairy:    { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1 },
};

export function assignRole(pokemon: TeamPokemon): string {
  const stats = Object.fromEntries(pokemon.stats.map((s) => [s.name, s.value]));
  const hp = stats["hp"] ?? 0;
  const atk = stats["attack"] ?? 0;
  const def = stats["defense"] ?? 0;
  const spa = stats["special-attack"] ?? 0;
  const spd = stats["special-defense"] ?? 0;
  const spe = stats["speed"] ?? 0;

  if (hp + def + spd > 300) return "Tank";
  if (atk > 110 && spe > 90) return "Physical Sweeper";
  if (spa > 110 && spe > 90) return "Special Sweeper";
  if (def + spd > 200) return "Wall";
  if (atk + spa > 200) return "Mixed Attacker";
  return "Support";
}

export function analyzeTeam(team: TeamPokemon[]): TeamAnalysisResult {
  const weaknesses: { type: string; multiplier: number }[] = [];
  const resistances: { type: string; multiplier: number }[] = [];
  const immunities: string[] = [];
  const offensiveCoverage: { type: string; multiplier: number }[] = [];
  let totalStats = 0;

  // Defensive analysis
  for (const attackingType of ALL_TYPES) {
    const multipliers = team.map((pokemon) => {
      let mult = 1;
      for (const defendingType of pokemon.types) {
        mult *= TYPE_CHART[attackingType]?.[defendingType] ?? 1;
      }
      return mult;
    });

    const bestMultiplier = Math.min(...multipliers);
    const avgMultiplier = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;

    if (bestMultiplier === 0) {
      immunities.push(attackingType);
    } else if (bestMultiplier < 1) {
      resistances.push({ type: attackingType, multiplier: bestMultiplier });
    } else if (avgMultiplier > 1) {
      weaknesses.push({ type: attackingType, multiplier: Math.round(avgMultiplier * 100) / 100 });
    }
  }

  // Offensive coverage: best multiplier the team can deal TO each defending type
  for (const defendingType of ALL_TYPES) {
    let maxMultiplier = 0;
    for (const pokemon of team) {
      for (const attackingType of pokemon.types) {
        const mult = TYPE_CHART[attackingType]?.[defendingType] ?? 1;
        maxMultiplier = Math.max(maxMultiplier, mult);
      }
    }
    offensiveCoverage.push({ type: defendingType, multiplier: maxMultiplier });
  }

  // Total stats
  for (const pokemon of team) {
    for (const stat of pokemon.stats) {
      totalStats += stat.value;
    }
  }

  // Synergy score
  const { score, breakdown } = calculateSynergyScore(team);

  // Role distribution
  const roleDistribution: Record<string, number> = {};
  for (const pokemon of team) {
    const role = assignRole(pokemon);
    roleDistribution[role] = (roleDistribution[role] || 0) + 1;
  }

  // Suggested counters
  const suggestedCounters = weaknesses
    .filter((w) => w.multiplier >= 2)
    .sort((a, b) => b.multiplier - a.multiplier)
    .map((w) => w.type);

  return {
    defensiveWeaknesses: weaknesses.sort((a, b) => b.multiplier - a.multiplier),
    defensiveResistances: resistances.sort((a, b) => a.multiplier - b.multiplier),
    immunities,
    offensiveCoverage,
    synergyScore: score,
    synergyBreakdown: breakdown,
    roleDistribution,
    suggestedCounters,
    totalStats,
  };
}

function calculateSynergyScore(team: TeamPokemon[]): { score: number; breakdown: Record<string, number> } {
  if (team.length === 0) return { score: 0, breakdown: {} };

  // Factor 1: Type diversity (0-25)
  const uniqueTypes = new Set(team.flatMap((p) => p.types));
  const diversityScore = Math.min(uniqueTypes.size / 12, 1) * 25;

  // Factor 2: Weakness coverage (0-25)
  const teamWeaknesses: string[] = [];
  for (const attackingType of ALL_TYPES) {
    const multipliers = team.map((pokemon) => {
      let mult = 1;
      for (const defendingType of pokemon.types) {
        mult *= TYPE_CHART[attackingType]?.[defendingType] ?? 1;
      }
      return mult;
    });
    const avgMultiplier = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;
    if (avgMultiplier > 1) teamWeaknesses.push(attackingType);
  }

  let coveredWeaknesses = 0;
  for (const w of teamWeaknesses) {
    const hasResister = team.some((pokemon) => {
      let mult = 1;
      for (const t of pokemon.types) {
        mult *= TYPE_CHART[w]?.[t] ?? 1;
      }
      return mult < 1;
    });
    if (hasResister) coveredWeaknesses++;
  }
  const coverageScore = teamWeaknesses.length > 0
    ? (coveredWeaknesses / teamWeaknesses.length) * 25
    : 25;

  // Factor 3: Offensive coverage (0-25)
  let coveredTypes = 0;
  for (const defendingType of ALL_TYPES) {
    let maxMult = 0;
    for (const pokemon of team) {
      for (const attackingType of pokemon.types) {
        maxMult = Math.max(maxMult, TYPE_CHART[attackingType]?.[defendingType] ?? 1);
      }
    }
    if (maxMult >= 2) coveredTypes++;
  }
  const offensiveScore = (coveredTypes / 18) * 25;

  // Factor 4: Role diversity (0-25)
  const roles = team.map(assignRole);
  const uniqueRoles = new Set(roles);
  const roleScore = Math.min(uniqueRoles.size / 4, 1) * 25;

  const total = Math.round(diversityScore + coverageScore + offensiveScore + roleScore);

  return {
    score: total,
    breakdown: {
      "Type Diversity": Math.round(diversityScore),
      "Weakness Coverage": Math.round(coverageScore),
      "Offensive Coverage": Math.round(offensiveScore),
      "Role Diversity": Math.round(roleScore),
    },
  };
}
