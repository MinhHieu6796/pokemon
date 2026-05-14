export interface TeamPokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
}

export interface SavedTeam {
  slots: (TeamPokemon | null)[];
  lastUpdated: string;
}

export interface TypeEffectiveness {
  type: string;
  multiplier: number;
}

export interface TeamAnalysisResult {
  defensiveWeaknesses: TypeEffectiveness[];
  defensiveResistances: TypeEffectiveness[];
  immunities: string[];
  offensiveCoverage: TypeEffectiveness[];
  synergyScore: number;
  synergyBreakdown: Record<string, number>;
  roleDistribution: Record<string, number>;
  suggestedCounters: string[];
  totalStats: number;
}
