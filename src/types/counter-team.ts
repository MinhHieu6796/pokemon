import { TeamPokemon } from "@/types/team";

export interface CounterPokemon extends TeamPokemon {
  role: string;
  counters: string[];
  resists: string[];
  effectivenessScore: number;
  defensiveScore: number;
}

export interface CounterTeamResult {
  members: CounterPokemon[];
  summary: string;
  targetedWeaknesses: string[];
}

export interface PoolPokemon {
  id: number;
  name: string;
  types: string[];
  stats: { name: string; value: number }[];
}
