import Image from "next/image";
import { TYPE_COLORS } from "@/utils/constants";
import { CounterTeamResult } from "@/types/counter-team";

interface CounterTeamPanelProps {
  result: CounterTeamResult;
  onClose: () => void;
}

export default function CounterTeamPanel({ result, onClose }: CounterTeamPanelProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>⚔️</span> Counter Team
          </h3>
          <p className="text-xs text-white/40 mt-0.5">{result.summary}</p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Counter Pokemon Grid */}
      <div className="grid grid-cols-2 gap-3">
        {result.members.map((member) => (
          <CounterCard key={member.id} member={member} />
        ))}
      </div>

      {/* Targeted weaknesses */}
      {result.targetedWeaknesses.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/40 mb-2">
            Primary targets:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.targetedWeaknesses.map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize text-red-300 bg-red-500/10 border border-red-500/20"
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

function CounterCard({ member }: { member: CounterTeamResult["members"][number] }) {
  const primaryTypeColor = TYPE_COLORS[member.types[0]] ?? "#A8A77A";

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
    >
      {/* Image */}
      <div
        className="relative flex items-center justify-center pt-4 pb-3 px-3"
        style={{
          background: `linear-gradient(135deg, ${primaryTypeColor}22, ${primaryTypeColor}08)`,
        }}
      >
        <div className="relative w-20 h-20">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 pt-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold capitalize text-white truncate">
            {member.name}
          </h4>
          <span className="text-[9px] text-white/30">
            #{String(member.id).padStart(3, "0")}
          </span>
        </div>

        {/* Types */}
        <div className="flex items-center gap-1 mb-1.5">
          {member.types.map((type) => (
            <span
              key={type}
              className="px-1.5 py-0.5 text-[8px] font-semibold rounded-full text-white capitalize"
              style={{ backgroundColor: TYPE_COLORS[type] ?? "#A8A77A" }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Role */}
        <p className="text-[9px] text-white/50 mb-1.5">{member.role}</p>

        {/* Why it counters */}
        <div className="space-y-0.5">
          {member.counters.length > 0 && (
            <p className="text-[9px] text-green-400/80">
              ⚔ Counters: {member.counters.slice(0, 2).join(", ")}
            </p>
          )}
          {member.resists.length > 0 && (
            <p className="text-[9px] text-blue-400/80">
              🛡 Resists: {member.resists.slice(0, 3).join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
