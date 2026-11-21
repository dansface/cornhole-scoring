import { DEFAULT_RULES, TEAM_COLORS } from './scoring'

const STORAGE_KEY = 'cornhole_pro_scorer_v2'

export function createDefaultState() {
  return {
    teamA: {
      name: 'Team A',
      color: TEAM_COLORS[0].hex,
    },
    teamB: {
      name: 'Team B',
      color: TEAM_COLORS[1].hex,
    },
    rules: { ...DEFAULT_RULES },
    startingHonors: 'A',
    frames: [],
    matchHistory: [],
  }
}

export function loadGameState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw)
    const fallback = createDefaultState()
    return {
      teamA: {
        name: (parsed.teamA && parsed.teamA.name) || fallback.teamA.name,
        color: (parsed.teamA && parsed.teamA.color) || fallback.teamA.color,
      },
      teamB: {
        name: (parsed.teamB && parsed.teamB.name) || fallback.teamB.name,
        color: (parsed.teamB && parsed.teamB.color) || fallback.teamB.color,
      },
      rules: {
        ...DEFAULT_RULES,
        ...(parsed.rules || {}),
      },
      startingHonors: parsed.startingHonors === 'B' ? 'B' : 'A',
      frames: Array.isArray(parsed.frames) ? parsed.frames : [],
      matchHistory: Array.isArray(parsed.matchHistory) ? parsed.matchHistory.slice(0, 20) : [],
    }
  } catch (err) {
    return createDefaultState()
  }
}

export function saveGameState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    // Ignore storage quota / private mode failures
  }
}
