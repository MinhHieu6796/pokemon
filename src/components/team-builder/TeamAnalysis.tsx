import { TeamAnalysisResult } from "@/types/team";
import { TYPE_COLORS } from "@/utils/constants";
import SynergyScore from "./SynergyScore";
import TeamCoverageChart from "./TeamCoverageChart";

interface TeamAnalysisProps {
  analysis: TeamAnalysisResult;
  teamSize: number;
}

export default function TeamAnalysis({ analysis, teamSize }: TeamAnalysisProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Synergy Score */}
      <SynergyScore score={analysis.synergyScore} breakdown={analysis.synergyBreakdown} />

      {/* Type Coverage Chart */}
      <TeamCoverageChart coverage={analysis.offensiveCoverage} />

      {/* Weaknesses */}
      {analysis.defensiveWeaknesses.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-red-400 mb-3">
            Team Weaknesses
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.defensiveWeaknesses.map((w) => (
              <TypeBadge key={w.type} type={w.type} multiplier={w.multiplier} variant="weakness" />
            ))}
          </div>
        </div>
      )}

      {/* Resistances */}
      {analysis.defensiveResistances.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            Resistances
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.defensiveResistances.map((r) => (
              <TypeBadge key={r.type} type={r.type} multiplier={r.multiplier} variant="resistance" />
            ))}
          </div>
        </div>
      )}

      {/* Immunities */}
      {analysis.immunities.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-gray-400 mb-3">
            Immunities
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.immunities.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize text-gray-300 bg-gray-500/20 border border-gray-500/30"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Role Distribution */}
      {Object.keys(analysis.roleDistribution).length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Role Distribution
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(analysis.roleDistribution).map(([role, count]) => (
              <span
                key={role}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 border border-white/10"
              >
                {role} ×{count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Counters */}
      {analysis.suggestedCounters.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-orange-400 mb-2">
            Watch Out For
          </h3>
          <p className="text-xs text-white/40 mb-3">
            Your team is vulnerable to these types. Consider adding Pokémon that resist them.
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.suggestedCounters.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize text-orange-300 bg-orange-500/10 border border-orange-500/30"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type, multiplier, variant }: { type: string; multiplier: number; variant: "weakness" | "resistance" }) {
  const isResistance = variant === "resistance";
  const bgMultiplier = multiplier === 0.25 ? "0.2" : "0.1";

  return (
    <span
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize border"
      style={{
        backgroundColor: isResistance
          ? `${TYPE_COLORS[type]}${bgMultiplier}`
          : `rgba(239, 68, 68, ${bgMultiplier === "0.1" ? "0.15" : "0.2"})`,
        borderColor: isResistance
          ? `${TYPE_COLORS[type]}40`
          : "rgba(239, 68, 68, 0.3)",
        color: isResistance ? (TYPE_COLORS[type] ?? "#22c55e") : "#f87171",
      }}
    >
      {type}
      <span className="opacity-70">{multiplier}x</span>
    </span>
  );
}
