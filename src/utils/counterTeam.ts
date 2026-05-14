import { TYPE_CHART, assignRole } from "./teamAnalysis";
import { TeamPokemon } from "@/types/team";
import { CounterPokemon, CounterTeamResult, PoolPokemon } from "@/types/counter-team";

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

interface ScoredCandidate {
  pokemon: PoolPokemon;
  offensiveScore: number;
  defensiveScore: number;
  stabilityScore: number;
  compositeScore: number;
}

function calcOffensiveScore(candidate: PoolPokemon, team: TeamPokemon[]): number {
  let total = 0;
  for (const target of team) {
    let maxMult = 0;
    for (const atkType of candidate.types) {
      for (const defType of target.types) {
        const mult = TYPE_CHART[atkType]?.[defType] ?? 1;
        maxMult = Math.max(maxMult, mult);
      }
    }
    total += maxMult;
  }
  // Normalize: max possible = 6 * 2 = 12
  return total / (team.length * 2);
}

function calcDefensiveScore(candidate: PoolPokemon, team: TeamPokemon[]): number {
  let total = 0;
  const attackTypes = team.flatMap((p) => p.types);

  for (const atkType of attackTypes) {
    for (const defType of candidate.types) {
      const mult = TYPE_CHART[atkType]?.[defType] ?? 1;
      // Invert: resisting (0.5) gives 1.5pts, immune (0) gives 2pts, weak (2) gives 0pts
      total += Math.max(0, 2 - mult);
    }
  }
  // Normalize
  const maxPossible = attackTypes.length * 2;
  return maxPossible > 0 ? total / maxPossible : 0;
}

function calcStabilityScore(candidate: PoolPokemon): number {
  const bst = candidate.stats.reduce((sum, s) => sum + s.value, 0);
  // Normalize: BST ranges from ~200 (weak) to ~700 (legendary)
  return Math.min(Math.max((bst - 200) / 500, 0), 1);
}

function getCounterDetails(candidate: PoolPokemon, team: TeamPokemon[]): { counters: string[]; resists: string[] } {
  const counters: string[] = [];
  const resistedTypes = new Set<string>();

  for (const target of team) {
    for (const atkType of candidate.types) {
      for (const defType of target.types) {
        const mult = TYPE_CHART[atkType]?.[defType] ?? 1;
        if (mult >= 2 && !counters.includes(target.name)) {
          counters.push(target.name);
        }
      }
    }
  }

  for (const atkType of team.flatMap((p) => p.types)) {
    for (const defType of candidate.types) {
      const mult = TYPE_CHART[atkType]?.[defType] ?? 1;
      if (mult < 1) {
        resistedTypes.add(atkType);
      }
    }
  }

  return { counters, resists: [...resistedTypes] };
}

export function findCounterTeam(team: TeamPokemon[], pool: PoolPokemon[]): CounterTeamResult {
  if (team.length === 0 || pool.length === 0) {
    return { members: [], summary: "No data available", targetedWeaknesses: [] };
  }

  // Phase 1: Score all candidates
  const scored: ScoredCandidate[] = pool.map((candidate) => ({
    pokemon: candidate,
    offensiveScore: calcOffensiveScore(candidate, team),
    defensiveScore: calcDefensiveScore(candidate, team),
    stabilityScore: calcStabilityScore(candidate),
    compositeScore: 0,
  }));

  // Set composite: 45% offensive, 35% defensive, 20% stability
  for (const c of scored) {
    c.compositeScore = c.offensiveScore * 0.45 + c.defensiveScore * 0.35 + c.stabilityScore * 0.2;
  }

  // Phase 2: Greedy selection with diversity penalty
  const selected: ScoredCandidate[] = [];
  const remaining = [...scored].sort((a, b) => b.compositeScore - a.compositeScore);

  while (selected.length < 6 && remaining.length > 0) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      if (selected.some((s) => s.pokemon.id === candidate.pokemon.id)) continue;

      // Diversity penalty: penalize type overlap with selected
      const selectedTypes = new Set(selected.flatMap((s) => s.pokemon.types));
      const overlap = candidate.pokemon.types.filter((t) => selectedTypes.has(t)).length;
      const diversityPenalty = overlap * 0.1;

      // Synergy bonus: reward covering remaining weaknesses
      let synergyBonus = 0;
      for (const teamMember of team) {
        for (const teamType of teamMember.types) {
          for (const candType of candidate.pokemon.types) {
            if (TYPE_CHART[candType]?.[teamType] === 2) {
              synergyBonus += 0.05;
            }
          }
        }
      }

      const adjusted = candidate.compositeScore - diversityPenalty + synergyBonus;
      if (adjusted > bestScore) {
        bestScore = adjusted;
        bestIdx = i;
      }
    }

    if (bestIdx >= 0) {
      selected.push(remaining[bestIdx]);
      remaining.splice(bestIdx, 1);
    }
  }

  // Phase 3: Build result
  const members: CounterPokemon[] = selected.map((c) => {
    const { counters, resists } = getCounterDetails(c.pokemon, team);
    return {
      id: c.pokemon.id,
      name: c.pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${c.pokemon.id}.png`,
      types: c.pokemon.types,
      stats: c.pokemon.stats,
      role: assignRole({
        id: c.pokemon.id,
        name: c.pokemon.name,
        image: "",
        types: c.pokemon.types,
        stats: c.pokemon.stats,
      }),
      counters,
      resists,
      effectivenessScore: Math.round(c.offensiveScore * 100) / 100,
      defensiveScore: Math.round(c.defensiveScore * 100) / 100,
    };
  });

  // Determine targeted weaknesses
  const targetedWeaknesses = new Set<string>();
  for (const member of members) {
    for (const name of member.counters) {
      const t = team.find((p) => p.name === name);
      if (t) {
        for (const type of t.types) {
          targetedWeaknesses.add(type);
        }
      }
    }
  }

  const weaknessList = [...targetedWeaknesses];
  const summary = weaknessList.length > 0
    ? `This team exploits your weakness${weaknessList.length > 1 ? "es" : ""} to ${weaknessList.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}`
    : "This team provides balanced coverage against your lineup";

  return {
    members,
    summary,
    targetedWeaknesses: weaknessList,
  };
}
