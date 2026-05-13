import React from 'react';

interface StatRowProps {
  name: string;
  value: number;
  color: string;
}

const StatRow: React.FC<StatRowProps> = ({ name, value, color }) => {
  const percentage = Math.min((value / 255) * 100, 100);

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 text-white/50 text-[10px] uppercase">
        {name.replace('-', ' ')}
      </div>
      <div className="flex-1 text-white font-bold text-sm">{value}</div>
      <div className="flex-1 w-32 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-2 bg-gradient-to-r from-${color}-400 to-${color}-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface PokemonStatsTableProps {
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

const PokemonStatsTable: React.FC<PokemonStatsTableProps> = ({ stats }) => {
  // Define colors for each stat type
  const statColors: Record<string, string> = {
    hp: 'green',
    attack: 'red',
    defense: 'blue',
    'special-attack': 'purple',
    'special-defense': 'orange',
    speed: 'yellow',
  };

  return (
    <div className="space-y-2">
      {stats.map((stat) => (
        <StatRow
          key={stat.stat.name}
          name={stat.stat.name}
          value={stat.base_stat}
          color={statColors[stat.stat.name] || 'gray'}
        />
      ))}
    </div>
  );
};

export default PokemonStatsTable;