<template>
  <div
    class="team-card"
    :class="{ 'is-four-bagger': isFourBagger }"
    :style="{ '--team-color': team.color }"
  >
    <div class="team-card-header">
      <div class="team-id">
        <span class="team-swatch"></span>
        <h3 class="team-title">{{ team.name }}</h3>
        <span v-if="hasHonors" class="first-pill" title="Throws first this frame">1st</span>
      </div>

      <div class="raw-badge" :class="{ 'is-gold': isFourBagger }">
        <span v-if="isFourBagger" class="four-bagger-label">4-BAGGER!</span>
        <span class="raw-pts">{{ rawPoints }} <small>pts</small></span>
      </div>
    </div>

    <!-- Visual 4-Bag Slots -->
    <div class="bag-tray" aria-label="4 bags for this frame">
      <div
        v-for="(slot, idx) in bagSlots"
        :key="idx"
        class="bag-slot"
        :class="`bag-${slot.type}`"
        :title="slot.title"
      >
        <span class="bag-points">{{ slot.label }}</span>
        <span class="bag-caption">{{ slot.caption }}</span>
      </div>
    </div>

    <!-- In the Hole (+3) Control -->
    <div class="bag-control-row">
      <div class="control-info">
        <span class="control-title">In the Hole</span>
        <span class="control-sub">Cornhole · 3 pts each</span>
      </div>

      <div class="stepper">
        <button
          type="button"
          class="step-btn step-minus"
          :disabled="disabled || bags.inHole <= 0"
          :aria-label="`Remove one bag in the hole for ${team.name}`"
          @click="adjustInHole(-1)"
        >
          −
        </button>
        <span class="step-count">{{ bags.inHole }}</span>
        <button
          type="button"
          class="step-btn step-plus step-hole"
          :disabled="disabled || totalScored >= 4"
          :aria-label="`Add one bag in the hole for ${team.name}`"
          @click="adjustInHole(1)"
        >
          +3
        </button>
      </div>
    </div>

    <!-- On the Board (+1) Control -->
    <div class="bag-control-row">
      <div class="control-info">
        <span class="control-title">On the Board</span>
        <span class="control-sub">Woody · 1 pt each</span>
      </div>

      <div class="stepper">
        <button
          type="button"
          class="step-btn step-minus"
          :disabled="disabled || bags.onBoard <= 0"
          :aria-label="`Remove one bag on the board for ${team.name}`"
          @click="adjustOnBoard(-1)"
        >
          −
        </button>
        <span class="step-count">{{ bags.onBoard }}</span>
        <button
          type="button"
          class="step-btn step-plus step-board"
          :disabled="disabled || totalScored >= 4"
          :aria-label="`Add one bag on the board for ${team.name}`"
          @click="adjustOnBoard(1)"
        >
          +1
        </button>
      </div>
    </div>

    <!-- Footer: Missed count + Quick actions -->
    <div class="team-card-footer">
      <span class="missed-summary">
        Off / Miss: <strong>{{ missedBags }}</strong>
      </span>
      <div class="quick-pills">
        <button
          type="button"
          class="quick-pill"
          :disabled="disabled || isFourBagger"
          title="Set 4 bags in the hole (12 pts)"
          @click="setFourBagger"
        >
          4-Bagger
        </button>
        <button
          type="button"
          class="quick-pill"
          :disabled="disabled || totalScored === 0"
          title="Clear this team's frame bags"
          @click="clearBags"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { BAGS_PER_FRAME, calculateRawPoints, getMissedBags } from '../utils/scoring'

export default {
  name: 'TeamFrameCard',
  props: {
    team: {
      type: Object,
      required: true,
    },
    bags: {
      type: Object,
      required: true,
    },
    hasHonors: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update-bags'],
  computed: {
    totalScored() {
      return this.bags.inHole + this.bags.onBoard
    },
    missedBags() {
      return getMissedBags(this.bags)
    },
    rawPoints() {
      return calculateRawPoints(this.bags)
    },
    isFourBagger() {
      return this.bags.inHole === BAGS_PER_FRAME
    },
    bagSlots() {
      const slots = []
      for (let i = 0; i < this.bags.inHole; i += 1) {
        slots.push({ type: 'hole', label: '3', caption: 'IN', title: 'In the hole (3 pts)' })
      }
      for (let i = 0; i < this.bags.onBoard; i += 1) {
        slots.push({ type: 'board', label: '1', caption: 'ON', title: 'On the board (1 pt)' })
      }
      while (slots.length < BAGS_PER_FRAME) {
        slots.push({ type: 'miss', label: '0', caption: 'OFF', title: 'Off board / miss (0 pts)' })
      }
      return slots
    },
  },
  methods: {
    adjustInHole(delta) {
      const nextInHole = this.bags.inHole + delta
      if (nextInHole < 0 || nextInHole + this.bags.onBoard > BAGS_PER_FRAME) return
      this.$emit('update-bags', { inHole: nextInHole, onBoard: this.bags.onBoard })
    },
    adjustOnBoard(delta) {
      const nextOnBoard = this.bags.onBoard + delta
      if (nextOnBoard < 0 || this.bags.inHole + nextOnBoard > BAGS_PER_FRAME) return
      this.$emit('update-bags', { inHole: this.bags.inHole, onBoard: nextOnBoard })
    },
    setFourBagger() {
      this.$emit('update-bags', { inHole: BAGS_PER_FRAME, onBoard: 0 })
    },
    clearBags() {
      this.$emit('update-bags', { inHole: 0, onBoard: 0 })
    },
  },
}
</script>

<style scoped>
.team-card {
  background: var(--surface-card);
  border: 1px solid var(--border-color);
  border-top: 4px solid var(--team-color);
  border-radius: 16px;
  padding: 15px 16px 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.team-card.is-four-bagger {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.18);
  border-color: #fbbf24;
  border-top-color: #f59e0b;
}

.team-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.team-id {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.team-swatch {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  background: var(--team-color);
  flex-shrink: 0;
}

.team-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.first-pill {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 1px 6px;
  flex-shrink: 0;
}

.raw-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 3px 10px;
  flex-shrink: 0;
}

.raw-badge.is-gold {
  background: #fef3c7;
  border-color: #f59e0b;
}

.four-bagger-label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #b45309;
}

.raw-pts {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.raw-pts small {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* 4-Bag Visual Tray */
.bag-tray {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.bag-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 11px;
  border: 1.5px dashed #cbd5e1;
  background: #f8fafc;
  color: #94a3b8;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.bag-slot.bag-board {
  border-style: solid;
  border-color: var(--team-color);
  background: var(--team-color);
  color: #ffffff;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.14);
}

.bag-slot.bag-hole {
  border-style: solid;
  border-color: #f59e0b;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.28);
}

.bag-points {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1;
}

.bag-caption {
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-top: 2px;
  opacity: 0.9;
}

/* Stepper Rows */
.bag-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.control-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.control-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.control-sub {
  font-size: 0.73rem;
  color: var(--text-muted);
}

.stepper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.step-btn {
  height: 42px;
  border-radius: 11px;
  border: 1px solid var(--border-color);
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease, background 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.step-btn:active:not(:disabled) {
  transform: scale(0.94);
}

.step-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.step-minus {
  width: 40px;
  background: #f1f5f9;
  color: #334155;
  font-size: 1.25rem;
  border-color: #e2e8f0;
}

.step-minus:hover:not(:disabled) {
  background: #e2e8f0;
}

.step-count {
  min-width: 24px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.step-plus {
  width: 58px;
  color: #ffffff;
  border: none;
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: 0.03em;
}

.step-hole {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 3px 8px rgba(217, 119, 6, 0.25);
}

.step-hole:hover:not(:disabled) {
  filter: brightness(1.06);
}

.step-board {
  background: var(--team-color);
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.16);
}

.step-board:hover:not(:disabled) {
  filter: brightness(1.08);
}

/* Footer */
.team-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  margin-top: 2px;
  border-top: 1px solid #f1f5f9;
}

.missed-summary {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.missed-summary strong {
  color: var(--text-secondary);
}

.quick-pills {
  display: flex;
  gap: 6px;
}

.quick-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.quick-pill:hover:not(:disabled) {
  background: #f1f5f9;
  color: var(--text-primary);
}

.quick-pill:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
