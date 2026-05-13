import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface PokemonStatsChartProps {
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

const PokemonStatsChart: React.FC<PokemonStatsChartProps> = ({ stats }) => {
  const statColors: Record<string, string> = {
    hp: '#22c55e',
    attack: '#ef4444',
    defense: '#3b82f6',
    'special-attack': '#a855f7',
    'special-defense': '#f97316',
    speed: '#eab308',
  };

  const statLabels: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD',
  };

  const chartData = stats.map((stat) => ({
    name: statLabels[stat.stat.name] || stat.stat.name,
    fullName: stat.stat.name.replace('-', ' '),
    value: stat.base_stat,
    color: statColors[stat.stat.name] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <XAxis type="number" domain={[0, 200]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#d1d5db', fontSize: 13, fontWeight: 500 }}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 15, 35, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value) => [`${value}`]}
        />
        {chartData.map((entry, index) => (
          <Bar
            key={`bar-${index}`}
            dataKey="value"
            fill={entry.color}
            radius={[0, 6, 6, 0]}
            barSize={22}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PokemonStatsChart;