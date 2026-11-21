<template>
  <section class="history-card" aria-label="Frame Sheet and Match Statistics">
    <div class="tabs-bar">
      <div class="tab-group" role="tablist">
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'frames' }"
          :aria-selected="activeTab === 'frames'"
          @click="activeTab = 'frames'"
        >
          Frame Sheet
          <span class="tab-count">{{ computedFrames.length }}</span>
        </button>

        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'stats' }"
          :aria-selected="activeTab === 'stats'"
          @click="activeTab = 'stats'"
        >
          Pro Stats
        </button>

        <button
          v-if="matchHistory.length > 0"
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'matches' }"
          :aria-selected="activeTab === 'matches'"
          @click="activeTab = 'matches'"
        >
          Past Games
          <span class="tab-count">{{ matchHistory.length }}</span>
        </button>
      </div>

      <span v-if="activeTab === 'frames' && washFrames > 0" class="wash-summary">
        {{ washFrames }} {{ washFrames === 1 ? 'Wash' : 'Washes' }}
      </span>
    </div>

    <!-- TAB 1: FRAME SHEET -->
    <div v-if="activeTab === 'frames'" class="tab-panel">
      <div v-if="computedFrames.length === 0" class="empty-state">
        <p class="empty-title">No frames scored yet</p>
        <p class="empty-sub">
          Tally each team's bags in the hole (+3) and on the board (+1) above, then tap
          <strong>Complete Frame 1</strong>.
        </p>
      </div>

      <div v-else class="table-scroll">
        <table class="frame-table">
          <thead>
            <tr>
              <th class="col-frame">Frm</th>
              <th class="col-team">
                <span class="th-team">
                  <span class="th-dot" :style="{ background: teamA.color }"></span>
                  {{ teamA.name }}
                </span>
              </th>
              <th class="col-score">Score</th>
              <th class="col-team">
                <span class="th-team">
                  <span class="th-dot" :style="{ background: teamB.color }"></span>
                  {{ teamB.name }}
                </span>
              </th>
              <th class="col-actions">Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="frame in computedFrames"
              :key="frame.id"
              :class="{ 'is-editing': editingFrameNumber === frame.number }"
            >
              <td class="col-frame">
                <span class="frame-num">{{ frame.number }}</span>
              </td>

              <!-- Team A Frame Cell -->
              <td class="col-team">
                <div class="frame-cell">
                  <span class="bags-detail" :title="`${frame.bagsA.inHole} in hole, ${frame.bagsA.onBoard} on board`">
                    <span class="bag-chip chip-in">{{ frame.bagsA.inHole }} in</span>
                    <span class="bag-chip chip-on">{{ frame.bagsA.onBoard }} on</span>
                  </span>
                  <span class="raw-and-net">
                    <span class="raw-mini">{{ frame.rawA }}</span>
                    <span v-if="frame.netA > 0" class="net-gain" :style="{ color: teamA.color }">
                      +{{ frame.netA }}
                    </span>
                    <span v-if="frame.bustedA" class="mini-tag tag-bust">BUST</span>
                    <span v-if="frame.isFourBaggerA" class="mini-tag tag-4b">4B</span>
                  </span>
                </div>
              </td>

              <!-- Running Total Center Column -->
              <td class="col-score">
                <div class="running-score">
                  <span :class="{ 'is-bold': frame.frameWinner === 'A' }">{{ frame.totalA }}</span>
                  <span class="score-dash">–</span>
                  <span :class="{ 'is-bold': frame.frameWinner === 'B' }">{{ frame.totalB }}</span>
                </div>
                <span v-if="frame.frameWinner === 'wash'" class="wash-label">Wash</span>
              </td>

              <!-- Team B Frame Cell -->
              <td class="col-team">
                <div class="frame-cell">
                  <span class="bags-detail" :title="`${frame.bagsB.inHole} in hole, ${frame.bagsB.onBoard} on board`">
                    <span class="bag-chip chip-in">{{ frame.bagsB.inHole }} in</span>
                    <span class="bag-chip chip-on">{{ frame.bagsB.onBoard }} on</span>
                  </span>
                  <span class="raw-and-net">
                    <span class="raw-mini">{{ frame.rawB }}</span>
                    <span v-if="frame.netB > 0" class="net-gain" :style="{ color: teamB.color }">
                      +{{ frame.netB }}
                    </span>
                    <span v-if="frame.bustedB" class="mini-tag tag-bust">BUST</span>
                    <span v-if="frame.isFourBaggerB" class="mini-tag tag-4b">4B</span>
                  </span>
                </div>
              </td>

              <td class="col-actions">
                <button
                  type="button"
                  class="edit-frame-btn"
                  :title="`Edit Frame ${frame.number}`"
                  :aria-label="`Edit Frame ${frame.number}`"
                  @click="$emit('edit-frame', frame.number)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: PRO STATS -->
    <div v-if="activeTab === 'stats'" class="tab-panel stats-panel">
      <div class="stats-legend">
        <span class="legend-team">
          <span class="th-dot" :style="{ background: teamA.color }"></span>
          {{ teamA.name }}
        </span>
        <span class="legend-mid">
          {{ statsA.framesPlayed }} {{ statsA.framesPlayed === 1 ? 'Frame' : 'Frames' }} ·
          {{ statsA.totalBagsThrown }} Bags Each
        </span>
        <span class="legend-team">
          {{ teamB.name }}
          <span class="th-dot" :style="{ background: teamB.color }"></span>
        </span>
      </div>

      <div class="stat-rows">
        <div v-for="row in statRows" :key="row.key" class="stat-row">
          <div class="stat-values">
            <span class="stat-val" :class="{ 'is-leader': row.leader === 'A' }">
              {{ row.displayA }}
            </span>
            <span class="stat-label" :title="row.tooltip">{{ row.label }}</span>
            <span class="stat-val" :class="{ 'is-leader': row.leader === 'B' }">
              {{ row.displayB }}
            </span>
          </div>
          <div class="stat-bar-track">
            <div
              class="stat-bar-fill bar-a"
              :style="{ width: row.pctA + '%', background: teamA.color }"
            ></div>
            <div
              class="stat-bar-fill bar-b"
              :style="{ width: row.pctB + '%', background: teamB.color }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: PAST GAMES -->
    <div v-if="activeTab === 'matches'" class="tab-panel matches-panel">
      <div class="matches-list">
        <div v-for="match in matchHistory" :key="match.id" class="match-item">
          <div class="match-teams">
            <span class="match-team" :class="{ 'is-win': match.winner === 'A' }">
              <span class="th-dot" :style="{ background: match.teamA.color }"></span>
              {{ match.teamA.name }}
              <strong>{{ match.scoreA }}</strong>
            </span>
            <span class="match-vs">vs</span>
            <span class="match-team" :class="{ 'is-win': match.winner === 'B' }">
              <strong>{{ match.scoreB }}</strong>
              {{ match.teamB.name }}
              <span class="th-dot" :style="{ background: match.teamB.color }"></span>
            </span>
          </div>
          <div class="match-meta">
            <span>{{ match.framesCount }} frames</span>
            <span>·</span>
            <span>PPR {{ match.pprA }} / {{ match.pprB }}</span>
            <span>·</span>
            <span>{{ match.dateLabel }}</span>
          </div>
        </div>
      </div>

      <div class="matches-footer">
        <button type="button" class="clear-history-btn" @click="$emit('clear-history')">
          Clear Past Games
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FrameHistory',
  props: {
    teamA: {
      type: Object,
      required: true,
    },
    teamB: {
      type: Object,
      required: true,
    },
    computedFrames: {
      type: Array,
      required: true,
    },
    statsA: {
      type: Object,
      required: true,
    },
    statsB: {
      type: Object,
      required: true,
    },
    washFrames: {
      type: Number,
      default: 0,
    },
    editingFrameNumber: {
      type: Number,
      default: null,
    },
    matchHistory: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['edit-frame', 'clear-history'],
  data() {
    return {
      activeTab: 'frames',
    }
  },
  watch: {
    matchHistory(next) {
      if (this.activeTab === 'matches' && (!next || next.length === 0)) {
        this.activeTab = 'frames'
      }
    },
  },
  computed: {
    statRows() {
      const a = this.statsA
      const b = this.statsB
      return [
        this.makeStatRow('ppr', 'Points Per Round (PPR)', a.ppr, b.ppr, a.ppr.toFixed(2), b.ppr.toFixed(2), 'Average raw points scored per frame (max 12.00)'),
        this.makeStatRow('inPct', 'In-Hole %', a.inHolePct, b.inHolePct, `${Math.round(a.inHolePct)}%`, `${Math.round(b.inHolePct)}%`, 'Percentage of all bags thrown that went in the hole'),
        this.makeStatRow('boardPct', 'Board % (In + On)', a.boardPct, b.boardPct, `${Math.round(a.boardPct)}%`, `${Math.round(b.boardPct)}%`, 'Percentage of all bags that stayed on the board or went in'),
        this.makeStatRow('inHole', 'Total Cornholes (+3)', a.totalInHole, b.totalInHole, `${a.totalInHole}`, `${b.totalInHole}`, 'Total bags in the hole'),
        this.makeStatRow('onBoard', 'Total Woodies (+1)', a.totalOnBoard, b.totalOnBoard, `${a.totalOnBoard}`, `${b.totalOnBoard}`, 'Total bags staying on the board'),
        this.makeStatRow('fourBaggers', 'Four-Baggers (12 pts)', a.fourBaggers, b.fourBaggers, `${a.fourBaggers}`, `${b.fourBaggers}`, 'Frames where all 4 bags went in the hole'),
        this.makeStatRow('framesWon', 'Frames Won', a.framesWon, b.framesWon, `${a.framesWon}`, `${b.framesWon}`, 'Frames where team outscored the opponent'),
        this.makeStatRow('bestFrame', 'Best Raw Frame', a.bestFrame, b.bestFrame, `${a.bestFrame}`, `${b.bestFrame}`, 'Highest raw points scored in a single frame'),
      ]
    },
  },
  methods: {
    makeStatRow(key, label, valA, valB, displayA, displayB, tooltip) {
      const total = valA + valB
      const pctA = total > 0 ? (valA / total) * 100 : 50
      const pctB = total > 0 ? (valB / total) * 100 : 50
      let leader = null
      if (valA > valB) leader = 'A'
      else if (valB > valA) leader = 'B'
      return { key, label, displayA, displayB, pctA, pctB, leader, tooltip }
    },
  },
}
</script>

<style scoped>
.history-card {
  background: var(--surface-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.tabs-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  background: #f8fafc;
  flex-wrap: wrap;
}

.tab-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: rgba(15, 23, 42, 0.04);
}

.tab-btn.is-active {
  background: #ffffff;
  color: var(--text-primary);
  border-color: var(--border-color);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.tab-count {
  font-size: 0.72rem;
  font-weight: 800;
  background: #e2e8f0;
  color: #334155;
  padding: 1px 6px;
  border-radius: 999px;
}

.wash-summary {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tab-panel {
  padding: 0;
}

.empty-state {
  text-align: center;
  padding: 32px 20px;
}

.empty-title {
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.empty-sub {
  font-size: 0.84rem;
  color: var(--text-muted);
  max-width: 420px;
  margin: 0 auto;
}

.table-scroll {
  overflow-x: auto;
}

.frame-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.frame-table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  background: #ffffff;
  white-space: nowrap;
}

.frame-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.frame-table tbody tr:last-child td {
  border-bottom: none;
}

.frame-table tbody tr.is-editing {
  background: #fffbeb;
}

.th-team {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.th-dot {
  width: 9px;
  height: 9px;
  border-radius: 3px;
  display: inline-block;
  flex-shrink: 0;
}

.col-frame {
  width: 48px;
  text-align: center !important;
}

.frame-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 0.9rem;
}

.col-score {
  text-align: center !important;
  white-space: nowrap;
}

.running-score {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.running-score .is-bold {
  color: var(--text-primary);
  font-weight: 800;
}

.score-dash {
  color: #cbd5e1;
}

.wash-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}

.frame-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bags-detail {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.bag-chip {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 5px;
  font-variant-numeric: tabular-nums;
}

.chip-in {
  background: #fef3c7;
  color: #b45309;
}

.chip-on {
  background: #f1f5f9;
  color: #475569;
}

.raw-and-net {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
}

.raw-mini {
  font-size: 0.76rem;
  color: var(--text-muted);
  font-weight: 600;
}

.net-gain {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 800;
}

.mini-tag {
  font-size: 0.62rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.tag-4b {
  background: #f59e0b;
  color: #0f172a;
}

.tag-bust {
  background: #fee2e2;
  color: #b91c1c;
}

.col-actions {
  width: 48px;
  text-align: center !important;
}

.edit-frame-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.edit-frame-btn svg {
  width: 15px;
  height: 15px;
}

.edit-frame-btn:hover {
  background: #f1f5f9;
  color: var(--text-primary);
}

/* Pro Stats */
.stats-panel {
  padding: 16px 18px 20px;
}

.stats-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.82rem;
  font-weight: 700;
}

.legend-team {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}

.legend-mid {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-values {
  display: grid;
  grid-template-columns: 64px 1fr 64px;
  align-items: center;
  gap: 8px;
}

.stat-val {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.stat-val:last-child {
  text-align: right;
}

.stat-val.is-leader {
  color: var(--text-primary);
  font-weight: 800;
}

.stat-label {
  text-align: center;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-bar-track {
  display: flex;
  height: 7px;
  border-radius: 999px;
  overflow: hidden;
  background: #f1f5f9;
  gap: 2px;
}

.stat-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.bar-a {
  border-radius: 999px 0 0 999px;
}

.bar-b {
  border-radius: 0 999px 999px 0;
}

/* Past Games */
.matches-panel {
  padding: 14px 16px;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.match-teams {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.match-team {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.match-team.is-win {
  color: var(--text-primary);
  font-weight: 700;
}

.match-vs {
  font-size: 0.72rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 700;
}

.match-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.matches-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.clear-history-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.clear-history-btn:hover {
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}
</style>
