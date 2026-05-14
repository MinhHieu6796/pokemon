import { TeamPokemon, TeamAnalysisResult } from "@/types/team";
import { CounterTeamResult } from "@/types/counter-team";
import TeamSlots from "./TeamSlots";
import TeamAnalysis from "./TeamAnalysis";
import PokemonPicker from "./PokemonPicker";
import CounterTeamPanel from "./CounterTeamPanel";

interface TeamBuilderLayoutProps {
  slots: (TeamPokemon | null)[];
  analysis: TeamAnalysisResult | null;
  counterResult: CounterTeamResult | null;
  isCounterLoading: boolean;
  onAddPokemon: (index: number, pokemon: TeamPokemon) => void;
  onRemovePokemon: (index: number) => void;
  onSwapPokemon: (from: number, to: number) => void;
  onClearTeam: () => void;
  onDragStart: (e: React.DragEvent, pokemon: TeamPokemon) => void;
  onFindCounters: () => void;
  onClearCounter: () => void;
}

export default function TeamBuilderLayout({
  slots,
  analysis,
  counterResult,
  isCounterLoading,
  onAddPokemon,
  onRemovePokemon,
  onSwapPokemon,
  onClearTeam,
  onDragStart,
  onFindCounters,
  onClearCounter,
}: TeamBuilderLayoutProps) {
  const teamCount = slots.filter((s) => s !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Team Builder</h1>
            <p className="text-white/50 text-sm">
              Drag Pokémon from the list into your team slots. Build a balanced team with good type coverage!
            </p>
          </div>
          {teamCount > 0 && (
            <button
              onClick={onClearTeam}
              className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-sm font-medium transition-all"
            >
              Clear Team
            </button>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Pokemon Picker */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <PokemonPicker onDragStart={onDragStart} />
            </div>
          </div>

          {/* Right: Team + Analysis */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <TeamSlots
                slots={slots}
                onAddPokemon={onAddPokemon}
                onRemovePokemon={onRemovePokemon}
                onSwapPokemon={onSwapPokemon}
              />
            </div>

            {analysis && <TeamAnalysis analysis={analysis} teamSize={teamCount} />}

            {/* Find Counters Button */}
            {teamCount >= 3 && !counterResult && (
              <button
                onClick={onFindCounters}
                disabled={isCounterLoading}
                className="w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-red-400 hover:to-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCounterLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Finding counters...
                  </span>
                ) : (
                  "⚔️ Find Counter Team"
                )}
              </button>
            )}

            {/* Counter Team Panel */}
            {isCounterLoading && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-center min-h-[200px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-sm text-white/40">Analyzing matchups...</p>
                </div>
              </div>
            )}

            {counterResult && (
              <CounterTeamPanel result={counterResult} onClose={onClearCounter} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
