import { TYPE_COLORS } from "@/utils/constants";

interface SynergyScoreProps {
  score: number;
  breakdown: Record<string, number>;
}

export default function SynergyScore({ score, breakdown }: SynergyScoreProps) {
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;

  const color = score < 40 ? "#ef4444" : score < 70 ? "#eab308" : "#22c55e";
  const label = score < 40 ? "Poor" : score < 70 ? "Average" : score < 90 ? "Good" : "Excellent";

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Synergy Score</h3>

      <div className="flex items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}</span>
            <span className="text-[10px] text-white/50 uppercase">{label}</span>
          </div>
        </div>

        {/* Factor Breakdown */}
        <div className="flex flex-col gap-2 flex-1">
          {Object.entries(breakdown).map(([name, value]) => {
            const max = 25;
            const pct = (value / max) * 100;
            const factorColor = pct < 50 ? "#ef4444" : pct < 80 ? "#eab308" : "#22c55e";

            return (
              <div key={name}>
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="text-white/60">{name}</span>
                  <span className="text-white/40">{value}/{max}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: factorColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
