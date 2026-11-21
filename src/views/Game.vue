<template>
  <div class="game-shell">
    <Header
      title="Cornhole Pro"
      @open-rules="showRules = true"
      @open-settings="showSettings = true"
      @new-game="requestNewGame"
    />

    <main class="game-main">
      <Scoreboard
        :teamA="teamA"
        :teamB="teamB"
        :scoreA="displayScores.A"
        :scoreB="displayScores.B"
        :statsA="gameState.stats.A"
        :statsB="gameState.stats.B"
        :currentFrameNumber="editingFrameNumber !== null ? editingFrameNumber : gameState.nextFrameNumber"
        :framesPlayed="gameState.computedFrames.length"
        :nextHonors="activeHonors"
        :winner="editingFrameNumber !== null ? null : gameState.winner"
        :rules="rules"
        :preview="activePreview"
        @open-settings="showSettings = true"
        @toggle-starting-honors="toggleStartingHonors"
      />

      <WinnerBanner
        v-if="gameState.winner && editingFrameNumber === null"
        :winner="gameState.winner"
        :teamA="teamA"
        :teamB="teamB"
        :scoreA="gameState.scoreA"
        :scoreB="gameState.scoreB"
        :statsA="gameState.stats.A"
        :statsB="gameState.stats.B"
        :framesPlayed="gameState.computedFrames.length"
        @rematch="startRematch"
        @undo-frame="undoLastFrame"
      />

      <FrameScorer
        v-if="!gameState.winner || editingFrameNumber !== null"
        ref="scorer"
        :teamA="teamA"
        :teamB="teamB"
        :draftBagsA="draftBagsA"
        :draftBagsB="draftBagsB"
        :activeHonors="activeHonors"
        :currentFrameNumber="gameState.nextFrameNumber"
        :editingFrameNumber="editingFrameNumber"
        :preview="activePreview"
        :rules="rules"
        :canUndo="frames.length > 0"
        :disabled="false"
        @update-draft-a="draftBagsA = $event"
        @update-draft-b="draftBagsB = $event"
        @clear-draft="clearDraft"
        @undo-frame="undoLastFrame"
        @submit-frame="submitFrame"
        @cancel-edit="cancelEdit"
      />

      <FrameHistory
        :teamA="teamA"
        :teamB="teamB"
        :computedFrames="gameState.computedFrames"
        :statsA="gameState.stats.A"
        :statsB="gameState.stats.B"
        :washFrames="gameState.washFrames"
        :editingFrameNumber="editingFrameNumber"
        :matchHistory="matchHistory"
        @edit-frame="startEditFrame"
        @clear-history="clearHistory"
      />
    </main>

    <!-- Modals -->
    <GameSettingsModal
      v-if="showSettings"
      :teamA="teamA"
      :teamB="teamB"
      :rules="rules"
      :startingHonors="startingHonors"
      @close="showSettings = false"
      @save="saveSettings"
    />

    <RulesModal
      v-if="showRules"
      @close="showRules = false"
    />

    <!-- In-app New Game Confirmation -->
    <div
      v-if="showResetConfirm"
      class="confirm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-confirm-title"
      @click.self="showResetConfirm = false"
    >
      <div class="confirm-sheet">
        <h2 id="reset-confirm-title" class="confirm-title">Start a New Game?</h2>
        <p class="confirm-text">
          This will clear the current match ({{ teamA.name }} {{ gameState.scoreA }} – {{ gameState.scoreB }} {{ teamB.name }})
          and reset to Frame 1. Your team names and rules will be kept.
        </p>
        <div class="confirm-actions">
          <button type="button" class="btn-keep" @click="showResetConfirm = false">
            Keep Playing
          </button>
          <button type="button" class="btn-confirm-reset" @click="confirmNewGame">
            Reset Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import Scoreboard from '../components/Scoreboard'
import FrameScorer from '../components/FrameScorer'
import WinnerBanner from '../components/WinnerBanner'
import FrameHistory from '../components/FrameHistory'
import GameSettingsModal from '../components/GameSettingsModal'
import RulesModal from '../components/RulesModal'
import { createEmptyBags, previewDraftFrame, replayGame } from '../utils/scoring'
import { loadGameState, saveGameState } from '../utils/storage'

export default {
  name: 'Game',
  components: {
    Header,
    Scoreboard,
    FrameScorer,
    WinnerBanner,
    FrameHistory,
    GameSettingsModal,
    RulesModal,
  },
  data() {
    const initial = loadGameState()
    return {
      teamA: initial.teamA,
      teamB: initial.teamB,
      rules: initial.rules,
      startingHonors: initial.startingHonors,
      frames: initial.frames,
      matchHistory: initial.matchHistory,
      draftBagsA: createEmptyBags(),
      draftBagsB: createEmptyBags(),
      editingFrameNumber: null,
      showSettings: false,
      showRules: false,
      showResetConfirm: false,
    }
  },
  computed: {
    gameState() {
      return replayGame(this.frames, this.rules, this.startingHonors)
    },
    activeHonors() {
      if (this.editingFrameNumber !== null) {
        const frame = this.gameState.computedFrames[this.editingFrameNumber - 1]
        if (frame) return frame.threwFirst
      }
      return this.gameState.nextHonors
    },
    displayScores() {
      if (this.editingFrameNumber !== null) {
        const prevIndex = this.editingFrameNumber - 2
        if (prevIndex >= 0 && this.gameState.computedFrames[prevIndex]) {
          return {
            A: this.gameState.computedFrames[prevIndex].totalA,
            B: this.gameState.computedFrames[prevIndex].totalB,
          }
        }
        return { A: 0, B: 0 }
      }
      return {
        A: this.gameState.scoreA,
        B: this.gameState.scoreB,
      }
    },
    activePreview() {
      return previewDraftFrame(
        this.displayScores.A,
        this.displayScores.B,
        this.draftBagsA,
        this.draftBagsB,
        this.rules
      )
    },
    persistedSnapshot() {
      return {
        teamA: this.teamA,
        teamB: this.teamB,
        rules: this.rules,
        startingHonors: this.startingHonors,
        frames: this.frames,
        matchHistory: this.matchHistory,
      }
    },
  },
  watch: {
    persistedSnapshot: {
      deep: true,
      handler(next) {
        saveGameState(next)
      },
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.showSettings = false
        this.showRules = false
        this.showResetConfirm = false
      }
    },
    clearDraft() {
      this.draftBagsA = createEmptyBags()
      this.draftBagsB = createEmptyBags()
    },
    submitFrame() {
      const bagsA = { inHole: this.draftBagsA.inHole, onBoard: this.draftBagsA.onBoard }
      const bagsB = { inHole: this.draftBagsB.inHole, onBoard: this.draftBagsB.onBoard }

      if (this.editingFrameNumber !== null) {
        const idx = this.editingFrameNumber - 1
        if (idx >= 0 && idx < this.frames.length) {
          const updated = this.frames.slice()
          updated[idx] = {
            ...updated[idx],
            bagsA,
            bagsB,
          }
          this.frames = updated
        }
        this.editingFrameNumber = null
        this.clearDraft()
        return
      }

      if (this.gameState.winner) return

      this.frames = [
        ...this.frames,
        {
          id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          bagsA,
          bagsB,
        },
      ]
      this.clearDraft()
    },
    undoLastFrame() {
      if (this.frames.length === 0) return
      const last = this.frames[this.frames.length - 1]
      this.frames = this.frames.slice(0, -1)
      this.editingFrameNumber = null
      this.draftBagsA = { inHole: last.bagsA.inHole, onBoard: last.bagsA.onBoard }
      this.draftBagsB = { inHole: last.bagsB.inHole, onBoard: last.bagsB.onBoard }
    },
    startEditFrame(frameNumber) {
      const idx = frameNumber - 1
      if (idx < 0 || idx >= this.frames.length) return
      const target = this.frames[idx]
      this.editingFrameNumber = frameNumber
      this.draftBagsA = { inHole: target.bagsA.inHole, onBoard: target.bagsA.onBoard }
      this.draftBagsB = { inHole: target.bagsB.inHole, onBoard: target.bagsB.onBoard }

      this.$nextTick(() => {
        if (this.$refs.scorer && this.$refs.scorer.$el) {
          this.$refs.scorer.$el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    },
    cancelEdit() {
      this.editingFrameNumber = null
      this.clearDraft()
    },
    toggleStartingHonors() {
      if (this.frames.length > 0) return
      this.startingHonors = this.startingHonors === 'A' ? 'B' : 'A'
    },
    archiveFinishedMatch() {
      if (!this.gameState.winner || this.frames.length === 0) return
      const now = new Date()
      const dateLabel = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      const entry = {
        id: `m-${Date.now()}`,
        teamA: { ...this.teamA },
        teamB: { ...this.teamB },
        scoreA: this.gameState.scoreA,
        scoreB: this.gameState.scoreB,
        winner: this.gameState.winner,
        framesCount: this.frames.length,
        pprA: this.gameState.stats.A.ppr.toFixed(1),
        pprB: this.gameState.stats.B.ppr.toFixed(1),
        dateLabel,
      }
      this.matchHistory = [entry, ...this.matchHistory].slice(0, 20)
    },
    startRematch() {
      this.archiveFinishedMatch()
      this.startingHonors = this.startingHonors === 'A' ? 'B' : 'A'
      this.frames = []
      this.editingFrameNumber = null
      this.clearDraft()
    },
    requestNewGame() {
      if (this.frames.length === 0) {
        this.clearDraft()
        return
      }
      if (this.gameState.winner) {
        this.archiveFinishedMatch()
        this.frames = []
        this.editingFrameNumber = null
        this.clearDraft()
        return
      }
      this.showResetConfirm = true
    },
    confirmNewGame() {
      this.frames = []
      this.editingFrameNumber = null
      this.clearDraft()
      this.showResetConfirm = false
    },
    saveSettings(payload) {
      this.teamA = payload.teamA
      this.teamB = payload.teamB
      this.rules = payload.rules
      this.startingHonors = payload.startingHonors
      this.showSettings = false
    },
    clearHistory() {
      this.matchHistory = []
    },
  },
}
</script>

<style scoped>
.game-shell {
  width: 100%;
}

.game-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Confirmation Modal */
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 110;
}

.confirm-sheet {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.28);
}

.confirm-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.confirm-text {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 18px;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-keep {
  height: 40px;
  padding: 0 15px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: #ffffff;
  color: var(--text-secondary);
  font-weight: 700;
  cursor: pointer;
}

.btn-confirm-reset {
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: #dc2626;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.btn-confirm-reset:hover {
  background: #b91c1c;
}
</style>
