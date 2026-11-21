export const BAGS_PER_FRAME = 4
export const POINTS_IN_HOLE = 3
export const POINTS_ON_BOARD = 1

export const TEAM_COLORS = [
  { id: 'red', name: 'Crimson', hex: '#dc2626', light: '#fef2f2', border: '#fecaca' },
  { id: 'blue', name: 'Royal Blue', hex: '#2563eb', light: '#eff6ff', border: '#bfdbfe' },
  { id: 'green', name: 'Emerald', hex: '#059669', light: '#ecfdf5', border: '#a7f3d0' },
  { id: 'amber', name: 'Gold', hex: '#d97706', light: '#fffbeb', border: '#fde68a' },
  { id: 'purple', name: 'Purple', hex: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe' },
  { id: 'teal', name: 'Teal', hex: '#0891b2', light: '#ecfeff', border: '#a5f3fc' },
  { id: 'orange', name: 'Orange', hex: '#ea580c', light: '#fff7ed', border: '#fed7aa' },
  { id: 'slate', name: 'Charcoal', hex: '#334155', light: '#f8fafc', border: '#cbd5e1' },
]

export const DEFAULT_RULES = {
  targetScore: 21,
  scoringMode: 'cancellation', // 'cancellation' (ACL pro) | 'straight'
  bustRule: 'none', // 'none' (ACL 21+) | 'exact' (bust back to bustScore)
  bustScore: 15,
}

export function getColorMeta(hex) {
  const found = TEAM_COLORS.find((c) => c.hex.toLowerCase() === String(hex || '').toLowerCase())
  return found || TEAM_COLORS[0]
}

export function createEmptyBags() {
  return { inHole: 0, onBoard: 0 }
}

export function clampBags(bags) {
  const rawInHole = Math.max(0, Math.min(BAGS_PER_FRAME, Math.floor(Number(bags && bags.inHole) || 0)))
  const maxOnBoard = BAGS_PER_FRAME - rawInHole
  const rawOnBoard = Math.max(0, Math.min(maxOnBoard, Math.floor(Number(bags && bags.onBoard) || 0)))
  return { inHole: rawInHole, onBoard: rawOnBoard }
}

export function getMissedBags(bags) {
  const safe = clampBags(bags)
  return BAGS_PER_FRAME - safe.inHole - safe.onBoard
}

export function calculateRawPoints(bags) {
  const safe = clampBags(bags)
  return safe.inHole * POINTS_IN_HOLE + safe.onBoard * POINTS_ON_BOARD
}

export function calculateFrameOutcome(bagsA, bagsB, scoringMode = 'cancellation') {
  const safeA = clampBags(bagsA)
  const safeB = clampBags(bagsB)
  const rawA = calculateRawPoints(safeA)
  const rawB = calculateRawPoints(safeB)

  let netA = 0
  let netB = 0
  let frameWinner = 'wash'

  if (scoringMode === 'straight') {
    netA = rawA
    netB = rawB
    if (rawA > rawB) frameWinner = 'A'
    else if (rawB > rawA) frameWinner = 'B'
  } else {
    if (rawA > rawB) {
      netA = rawA - rawB
      frameWinner = 'A'
    } else if (rawB > rawA) {
      netB = rawB - rawA
      frameWinner = 'B'
    }
  }

  return {
    bagsA: safeA,
    bagsB: safeB,
    rawA,
    rawB,
    netA,
    netB,
    frameWinner,
    isFourBaggerA: safeA.inHole === BAGS_PER_FRAME,
    isFourBaggerB: safeB.inHole === BAGS_PER_FRAME,
  }
}

export function applyScoreWithRules(currentScore, pointsToAdd, rules) {
  const target = Number(rules.targetScore) || 21
  const rawNext = currentScore + pointsToAdd

  if (rules.bustRule === 'exact' && rawNext > target) {
    const safeBust = Math.min(Number(rules.bustScore) || 15, target - 1)
    return {
      score: Math.max(0, safeBust),
      busted: true,
    }
  }

  return {
    score: rawNext,
    busted: false,
  }
}

export function determineWinner(scoreA, scoreB, rules) {
  const target = Number(rules.targetScore) || 21

  if (rules.bustRule === 'exact') {
    const aWon = scoreA === target
    const bWon = scoreB === target
    if (aWon && !bWon) return 'A'
    if (bWon && !aWon) return 'B'
    return null
  }

  const aReached = scoreA >= target
  const bReached = scoreB >= target

  if (aReached && !bReached) return 'A'
  if (bReached && !aReached) return 'B'
  if (aReached && bReached) {
    if (scoreA > scoreB) return 'A'
    if (scoreB > scoreA) return 'B'
  }

  return null
}

function emptyTeamStats() {
  return {
    framesPlayed: 0,
    totalRawPoints: 0,
    ppr: 0,
    totalBagsThrown: 0,
    totalInHole: 0,
    totalOnBoard: 0,
    totalMissed: 0,
    inHolePct: 0,
    boardPct: 0,
    fourBaggers: 0,
    framesWon: 0,
    bestFrame: 0,
  }
}

function finalizeTeamStats(stats) {
  const totalBags = stats.framesPlayed * BAGS_PER_FRAME
  stats.totalBagsThrown = totalBags
  stats.totalMissed = totalBags - stats.totalInHole - stats.totalOnBoard
  stats.ppr = stats.framesPlayed > 0 ? stats.totalRawPoints / stats.framesPlayed : 0
  stats.inHolePct = totalBags > 0 ? (stats.totalInHole / totalBags) * 100 : 0
  stats.boardPct = totalBags > 0 ? ((stats.totalInHole + stats.totalOnBoard) / totalBags) * 100 : 0
  return stats
}

/**
 * Deterministically replays all committed frames to compute running scores,
 * honors, winner state, and full pro cornhole statistics.
 */
export function replayGame(frames, rules = DEFAULT_RULES, startingHonors = 'A') {
  let scoreA = 0
  let scoreB = 0
  let currentHonors = startingHonors === 'B' ? 'B' : 'A'
  let winner = null
  let winningFrameNumber = null
  let washFrames = 0

  const statsA = emptyTeamStats()
  const statsB = emptyTeamStats()

  const computedFrames = (frames || []).map((frame, index) => {
    const frameNumber = index + 1
    const outcome = calculateFrameOutcome(frame.bagsA, frame.bagsB, rules.scoringMode)

    const nextA = applyScoreWithRules(scoreA, outcome.netA, rules)
    const nextB = applyScoreWithRules(scoreB, outcome.netB, rules)

    scoreA = nextA.score
    scoreB = nextB.score

    const threwFirst = currentHonors

    if (outcome.frameWinner === 'A') {
      currentHonors = 'A'
      statsA.framesWon += 1
    } else if (outcome.frameWinner === 'B') {
      currentHonors = 'B'
      statsB.framesWon += 1
    } else {
      washFrames += 1
    }

    // Stats accumulation
    statsA.framesPlayed += 1
    statsA.totalRawPoints += outcome.rawA
    statsA.totalInHole += outcome.bagsA.inHole
    statsA.totalOnBoard += outcome.bagsA.onBoard
    if (outcome.isFourBaggerA) statsA.fourBaggers += 1
    if (outcome.rawA > statsA.bestFrame) statsA.bestFrame = outcome.rawA

    statsB.framesPlayed += 1
    statsB.totalRawPoints += outcome.rawB
    statsB.totalInHole += outcome.bagsB.inHole
    statsB.totalOnBoard += outcome.bagsB.onBoard
    if (outcome.isFourBaggerB) statsB.fourBaggers += 1
    if (outcome.rawB > statsB.bestFrame) statsB.bestFrame = outcome.rawB

    if (!winner) {
      const frameGameWinner = determineWinner(scoreA, scoreB, rules)
      if (frameGameWinner) {
        winner = frameGameWinner
        winningFrameNumber = frameNumber
      }
    }

    return {
      id: frame.id || `frame-${frameNumber}`,
      number: frameNumber,
      threwFirst,
      bagsA: outcome.bagsA,
      bagsB: outcome.bagsB,
      rawA: outcome.rawA,
      rawB: outcome.rawB,
      netA: outcome.netA,
      netB: outcome.netB,
      frameWinner: outcome.frameWinner,
      isFourBaggerA: outcome.isFourBaggerA,
      isFourBaggerB: outcome.isFourBaggerB,
      totalA: scoreA,
      totalB: scoreB,
      bustedA: nextA.busted,
      bustedB: nextB.busted,
    }
  })

  return {
    scoreA,
    scoreB,
    nextHonors: currentHonors,
    nextFrameNumber: computedFrames.length + 1,
    winner,
    winningFrameNumber,
    washFrames,
    computedFrames,
    stats: {
      A: finalizeTeamStats(statsA),
      B: finalizeTeamStats(statsB),
    },
  }
}

/**
 * Computes a live preview of what submitting the draft frame will do.
 */
export function previewDraftFrame(scoreA, scoreB, draftBagsA, draftBagsB, rules = DEFAULT_RULES) {
  const outcome = calculateFrameOutcome(draftBagsA, draftBagsB, rules.scoringMode)
  const nextA = applyScoreWithRules(scoreA, outcome.netA, rules)
  const nextB = applyScoreWithRules(scoreB, outcome.netB, rules)
  const willWin = determineWinner(nextA.score, nextB.score, rules)

  return {
    ...outcome,
    projectedScoreA: nextA.score,
    projectedScoreB: nextB.score,
    willBustA: nextA.busted,
    willBustB: nextB.busted,
    willWin,
  }
}
