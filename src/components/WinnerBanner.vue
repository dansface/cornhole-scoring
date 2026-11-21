<template>
  <section
    class="winner-banner"
    :style="{ '--winner-color': winningTeam.color }"
    aria-live="polite"
  >
    <div class="winner-content">
      <div class="trophy-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      <div class="winner-text">
        <span class="winner-kicker">GAME OVER · {{ framesPlayed }} {{ framesPlayed === 1 ? 'FRAME' : 'FRAMES' }}</span>
        <h2 class="winner-headline">{{ winningTeam.name }} Wins!</h2>
        <p class="winner-sub">
          Final Score: <strong>{{ scoreA }} – {{ scoreB }}</strong>
          · Winner PPR: <strong>{{ winningStats.ppr.toFixed(1) }}</strong>
          <span v-if="winningStats.fourBaggers > 0">
            · {{ winningStats.fourBaggers }} {{ winningStats.fourBaggers === 1 ? 'Four-Bagger' : 'Four-Baggers' }}
          </span>
        </p>
      </div>
    </div>

    <div class="winner-actions">
      <button type="button" class="btn-rematch" @click="$emit('rematch')">
        Play Rematch
      </button>
      <button type="button" class="btn-undo-win" @click="$emit('undo-frame')">
        Undo Last Frame
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WinnerBanner',
  props: {
    winner: {
      type: String,
      required: true,
    },
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
    framesPlayed: {
      type: Number,
      required: true,
    },
  },
  emits: ['rematch', 'undo-frame'],
  computed: {
    winningTeam() {
      return this.winner === 'A' ? this.teamA : this.teamB
    },
    winningStats() {
      return this.winner === 'A' ? this.statsA : this.statsB
    },
  },
}
</script>

<style scoped>
.winner-banner {
  background: var(--surface-card);
  border: 2px solid var(--winner-color);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
}

.winner-content {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.trophy-badge {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--winner-color);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
}

.trophy-badge svg {
  width: 28px;
  height: 28px;
}

.winner-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.winner-kicker {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  color: var(--winner-color);
}

.winner-headline {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary);
}

.winner-sub {
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.winner-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-rematch {
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: none;
  background: var(--winner-color);
  color: #ffffff;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
  transition: filter 0.15s ease, transform 0.1s ease;
}

.btn-rematch:hover {
  filter: brightness(1.08);
}

.btn-rematch:active {
  transform: scale(0.97);
}

.btn-undo-win {
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #f8fafc;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-undo-win:hover {
  background: #f1f5f9;
  color: var(--text-primary);
}
</style>
