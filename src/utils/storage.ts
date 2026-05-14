import { SavedTeam } from "@/types/team";

const STORAGE_KEY = "pokemon_team_builder";
const TEAM_SIZE = 6;

export function loadTeam(): SavedTeam | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedTeam;
    // Ensure correct shape
    if (!Array.isArray(parsed.slots)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTeam(slots: (SavedTeam["slots"][number])[]): void {
  try {
    if (typeof localStorage === "undefined") return;
    const team: SavedTeam = {
      slots,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function clearTeam(): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function emptySlots(): (SavedTeam["slots"][number])[] {
  return Array(TEAM_SIZE).fill(null);
}
