<template>
  <section class="scoreboard-card" aria-label="Match Scoreboard">
    <div class="sb-topbar">
      <div class="sb-frame-pill" :class="{ 'is-final': Boolean(winner) }">
        <span class="pulse-dot" v-if="!winner"></span>
        <span v-if="winner">FINAL · {{ framesPlayed }} {{ framesPlayed === 1 ? 'FRAME' : 'FRAMES' }}</span>
        <span v-else>FRAME {{ currentFrameNumber }}</span>
      </div>

      <button
        type="button"
        class="sb-rules-chip"
        title="Click to edit game rules"
        @click="$emit('open-settings')"
      >
        <span>{{ rulesSummary }}</span>
      </button>
    </div>

    <div class="sb-teams">
      <!-- Team A -->
      <div
        class="sb-team"
        :class="{ 'is-leading': scoreA > scoreB, 'is-winner': winner === 'A' }"
        :style="{ '--team-color': teamA.color }"
      >
        <div class="sb-team-stripe"></div>

        <div class="sb-team-header">
          <button
            type="button"
            class="sb-team-name"
            title="Edit team name and color"
            @click="$emit('open-settings')"
          >
            <span class="color-dot"></span>
            <span class="name-text">{{ teamA.name }}</span>
          </button>

          <button
            v-if="!winner && nextHonors === 'A'"
            type="button"
            class="honors-badge"
            :class="{ 'is-clickable': framesPlayed === 0 }"
            :title="framesPlayed === 0 ? 'Click to switch who throws first' : 'Throws first this frame (Honors)'"
            @click="framesPlayed === 0 && $emit('toggle-starting-honors')"
          >
            <span class="bag-mini"></span>
            <span>Throws 1st</span>
          </button>
          <span v-else-if="winner === 'A'" class="winner-chip">WINNER</span>
        </div>

        <div class="sb-score-row">
          <span class="sb-score">{{ scoreA }}</span>
          <span
            v-if="!winner && hasDraftActivity && preview.netA > 0"
            class="sb-delta"
            :class="{ 'is-bust': preview.willBustA }"
          >
            {{ preview.willBustA ? `BUST → ${preview.projectedScoreA}` : `+${preview.netA}` }}
          </span>
        </div>

        <div class="sb-progress-track" :title="`${scoreA} of ${rules.targetScore} points`">
          <div class="sb-progress-fill" :style="{ width: progressA + '%' }"></div>
        </div>

        <div class="sb-meta-row">
          <span class="sb-stat">PPR <strong>{{ statsA.ppr.toFixed(1) }}</strong></span>
          <span class="sb-stat-sep">·</span>
          <span class="sb-stat">In <strong>{{ Math.round(statsA.inHolePct) }}%</strong></span>
        </div>
      </div>

      <div class="sb-vs" aria-hidden="true">
        <span>VS</span>
      </div>

      <!-- Team B -->
      <div
        class="sb-team"
        :class="{ 'is-leading': scoreB > scoreA, 'is-winner': winner === 'B' }"
        :style="{ '--team-color': teamB.color }"
      >
        <div class="sb-team-stripe"></div>

        <div class="sb-team-header">
          <button
            type="button"
            class="sb-team-name"
            title="Edit team name and color"
            @click="$emit('open-settings')"
          >
            <span class="color-dot"></span>
            <span class="name-text">{{ teamB.name }}</span>
          </button>

          <button
            v-if="!winner && nextHonors === 'B'"
            type="button"
            class="honors-badge"
            :class="{ 'is-clickable': framesPlayed === 0 }"
            :title="framesPlayed === 0 ? 'Click to switch who throws first' : 'Throws first this frame (Honors)'"
            @click="framesPlayed === 0 && $emit('toggle-starting-honors')"
          >
            <span class="bag-mini"></span>
            <span>Throws 1st</span>
          </button>
          <span v-else-if="winner === 'B'" class="winner-chip">WINNER</span>
        </div>

        <div class="sb-score-row">
          <span class="sb-score">{{ scoreB }}</span>
          <span
            v-if="!winner && hasDraftActivity && preview.netB > 0"
            class="sb-delta"
            :class="{ 'is-bust': preview.willBustB }"
          >
            {{ preview.willBustB ? `BUST → ${preview.projectedScoreB}` : `+${preview.netB}` }}
          </span>
        </div>

        <div class="sb-progress-track" :title="`${scoreB} of ${rules.targetScore} points`">
          <div class="sb-progress-fill" :style="{ width: progressB + '%' }"></div>
        </div>

        <div class="sb-meta-row">
          <span class="sb-stat">PPR <strong>{{ statsB.ppr.toFixed(1) }}</strong></span>
          <span class="sb-stat-sep">·</span>
          <span class="sb-stat">In <strong>{{ Math.round(statsB.inHolePct) }}%</strong></span>
        </div>
      </div>
    </div>

    <!-- Live Cancellation Preview Strip -->
    <div v-if="!winner" class="sb-preview-bar" :class="previewBarClass">
      <div class="sb-preview-left">
        <span class="sb-preview-label">Frame {{ currentFrameNumber }} Live</span>
        <span class="sb-preview-math">
          {{ preview.rawA }} pts vs {{ preview.rawB }} pts
        </span>
      </div>
      <div class="sb-preview-outcome">
        <span v-if="preview.willWin" class="match-point-tag">MATCH POINT</span>
        <span v-if="preview.willBustA || preview.willBustB" class="bust-tag">BUST!</span>
        <span class="outcome-text">{{ previewOutcomeText }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Scoreboard',
  props: {
    teamA: {
      type: Object,
      required: true,
    },
    teamB: {
      type: Object,
      required: true,
    },
    scoreA: {
      type: Number,
      required: true,
    },
    scoreB: {
      type: Number,
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
    currentFrameNumber: {
      type: Number,
      required: true,
    },
    framesPlayed: {
      type: Number,
      required: true,
    },
    nextHonors: {
      type: String,
      required: true,
    },
    winner: {
      type: String,
      default: null,
    },
    rules: {
      type: Object,
      required: true,
    },
    preview: {
      type: Object,
      required: true,
    },
  },
  emits: ['open-settings', 'toggle-starting-honors'],
  computed: {
    progressA() {
      const target = Number(this.rules.targetScore) || 21
      return Math.min(100, Math.round((this.scoreA / target) * 100))
    },
    progressB() {
      const target = Number(this.rules.targetScore) || 21
      return Math.min(100, Math.round((this.scoreB / target) * 100))
    },
    hasDraftActivity() {
      return this.preview.rawA > 0 || this.preview.rawB > 0
    },
    rulesSummary() {
      const target = this.rules.targetScore
      const mode = this.rules.scoringMode === 'straight' ? 'Straight' : 'Cancellation'
      const bust = this.rules.bustRule === 'exact' ? `Exact ${target} (Bust ${this.rules.bustScore})` : `First to ${target}`
      return `${bust} · ${mode}`
    },
    previewBarClass() {
      if (this.preview.willWin) return 'is-match-point'
      if (this.preview.willBustA || this.preview.willBustB) return 'is-bust-warning'
      return ''
    },
    previewOutcomeText() {
      if (this.rules.scoringMode === 'straight') {
        if (this.preview.rawA === 0 && this.preview.rawB === 0) return 'Enter bags below'
        return `+${this.preview.netA} / +${this.preview.netB}`
      }
      if (this.preview.frameWinner === 'A') {
        return `${this.teamA.name} +${this.preview.netA}`
      }
      if (this.preview.frameWinner === 'B') {
        return `${this.teamB.name} +${this.preview.netB}`
      }
      if (this.preview.rawA === 0 && this.preview.rawB === 0) {
        return 'Wash (0 pts)'
      }
      return `Wash — cancels to 0`
    },
  },
}
</script>

<style scoped>
.scoreboard-card {
  background: linear-gradient(180deg, #0f172a 0%, #162033 100%);
  color: #f8fafc;
  border-radius: 20px;
  padding: 16px 18px 18px;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.2), 0 2px 6px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sb-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.sb-frame-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 5px 12px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f8fafc;
}

.sb-frame-pill.is-final {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.45);
  color: #fde68a;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
}

.sb-rules-chip {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #cbd5e1;
  border-radius: 999px;
  padding: 4px 11px;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.sb-rules-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.sb-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: 12px;
}

.sb-vs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sb-vs span {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #64748b;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sb-team {
  position: relative;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 13px 14px 12px;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.sb-team.is-winner {
  background: rgba(255, 255, 255, 0.09);
  border-color: var(--team-color);
  box-shadow: 0 0 0 1px var(--team-color) inset;
}

.sb-team-stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--team-color);
}

.sb-team-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  min-height: 24px;
}

.sb-team-name {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: transparent;
  border: none;
  padding: 0;
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 0;
  text-align: left;
}

.sb-team-name:hover .name-text {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: var(--team-color);
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.16);
}

.name-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.honors-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 2px 7px;
  flex-shrink: 0;
  cursor: default;
}

.honors-badge.is-clickable {
  cursor: pointer;
}

.honors-badge.is-clickable:hover {
  background: rgba(255, 255, 255, 0.2);
}

.bag-mini {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: var(--team-color);
  display: inline-block;
}

.winner-chip {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: #f59e0b;
  color: #0f172a;
  padding: 2px 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.sb-score-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 4px 0 6px;
}

.sb-score {
  font-family: var(--font-display);
  font-size: 3.6rem;
  font-weight: 800;
  line-height: 0.96;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.sb-delta {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: #4ade80;
  background: rgba(34, 197, 94, 0.16);
  border: 1px solid rgba(34, 197, 94, 0.35);
  padding: 2px 7px;
  border-radius: 7px;
  font-variant-numeric: tabular-nums;
}

.sb-delta.is-bust {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.45);
}

.sb-progress-track {
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 9px;
}

.sb-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--team-color);
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.sb-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.sb-meta-row strong {
  color: #e2e8f0;
  font-weight: 700;
}

.sb-stat-sep {
  opacity: 0.45;
}

.sb-preview-bar {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sb-preview-bar.is-match-point {
  background: rgba(245, 158, 11, 0.14);
  border-color: rgba(245, 158, 11, 0.4);
}

.sb-preview-bar.is-bust-warning {
  background: rgba(239, 68, 68, 0.14);
  border-color: rgba(239, 68, 68, 0.4);
}

.sb-preview-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
}

.sb-preview-label {
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
}

.sb-preview-math {
  color: #e2e8f0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.sb-preview-outcome {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
}

.match-point-tag {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  background: #f59e0b;
  color: #0f172a;
  padding: 2px 7px;
  border-radius: 5px;
}

.bust-tag {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  background: #ef4444;
  color: #ffffff;
  padding: 2px 7px;
  border-radius: 5px;
}

@media (max-width: 540px) {
  .scoreboard-card {
    padding: 14px;
    border-radius: 16px;
  }

  .sb-vs {
    display: none;
  }

  .sb-teams {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .sb-team {
    padding: 11px 11px 10px;
  }

  .sb-score {
    font-size: 2.85rem;
  }

  .honors-badge {
    padding: 2px 6px;
    font-size: 0.6rem;
  }
}
</style>
