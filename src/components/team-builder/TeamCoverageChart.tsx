"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TypeEffectiveness } from "@/types/team";

interface TeamCoverageChartProps {
  coverage: TypeEffectiveness[];
}

const TYPE_ORDER = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export default function TeamCoverageChart({ coverage }: TeamCoverageChartProps) {
  const data = TYPE_ORDER.map((type) => {
    const entry = coverage.find((c) => c.type === type);
    const multiplier = entry?.multiplier ?? 1;
    return {
      name: type,
      value: multiplier,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };
  });

  const getBarColor = (multiplier: number): string => {
    if (multiplier === 0) return "#6b7280";
    if (multiplier < 1) return "#ef4444";
    if (multiplier === 1) return "#eab308";
    return "#22c55e";
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-white mb-2">Type Coverage</h3>
      <p className="text-xs text-white/40 mb-4">
        Best multiplier your team can deal against each type
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            tickFormatter={(v: string) => v.substring(0, 3)}
          />
          <YAxis
            domain={[0, 4]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            ticks={[0, 0.5, 1, 2, 4]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 15, 35, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
            // @ts-expect-error recharts tooltip types are overly strict
            formatter={(value: unknown, _name: string, props: { payload: { label: string } }) => [
              `${value}x`,
              props.payload.label,
            ]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> Not very effective</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500 inline-block" /> Neutral</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" /> Super effective</span>
      </div>
    </div>
  );
}
