<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-title" @click.self="$emit('close')">
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 id="settings-title" class="modal-title">Teams &amp; Match Settings</h2>
        <button type="button" class="close-btn" aria-label="Close settings" @click="$emit('close')">
          ×
        </button>
      </div>

      <form class="modal-body" @submit.prevent="save">
        <!-- Team A -->
        <div class="field-group">
          <div class="field-header-row">
            <label class="field-label" for="team-a-input">Team A</label>
            <button type="button" class="swap-btn" @click="swapTeams">
              ⇄ Swap Teams
            </button>
          </div>
          <input
            id="team-a-input"
            v-model.trim="form.teamA.name"
            type="text"
            class="text-input"
            maxlength="24"
            placeholder="Team A"
          />
          <div class="color-swatches" role="radiogroup" aria-label="Team A bag color">
            <button
              v-for="c in colors"
              :key="'a-' + c.id"
              type="button"
              class="swatch-btn"
              :class="{ 'is-selected': form.teamA.color === c.hex }"
              :style="{ background: c.hex }"
              :title="c.name"
              :aria-label="c.name"
              @click="form.teamA.color = c.hex"
            ></button>
          </div>
        </div>

        <!-- Team B -->
        <div class="field-group">
          <label class="field-label" for="team-b-input">Team B</label>
          <input
            id="team-b-input"
            v-model.trim="form.teamB.name"
            type="text"
            class="text-input"
            maxlength="24"
            placeholder="Team B"
          />
          <div class="color-swatches" role="radiogroup" aria-label="Team B bag color">
            <button
              v-for="c in colors"
              :key="'b-' + c.id"
              type="button"
              class="swatch-btn"
              :class="{ 'is-selected': form.teamB.color === c.hex }"
              :style="{ background: c.hex }"
              :title="c.name"
              :aria-label="c.name"
              @click="form.teamB.color = c.hex"
            ></button>
          </div>
        </div>

        <hr class="divider" />

        <!-- Target Score -->
        <div class="field-group">
          <span class="field-label">Winning Target Score</span>
          <div class="segmented-row">
            <button
              v-for="score in [11, 15, 21]"
              :key="score"
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.rules.targetScore === score }"
              @click="setTargetScore(score)"
            >
              {{ score }} pts{{ score === 21 ? ' (Pro)' : '' }}
            </button>
          </div>
        </div>

        <!-- Scoring Mode -->
        <div class="field-group">
          <span class="field-label">Frame Scoring Mode</span>
          <div class="segmented-row two-col">
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.rules.scoringMode === 'cancellation' }"
              @click="form.rules.scoringMode = 'cancellation'"
            >
              <strong>Cancellation</strong>
              <small>ACL Pro · Net diff only</small>
            </button>
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.rules.scoringMode === 'straight' }"
              @click="form.rules.scoringMode = 'straight'"
            >
              <strong>Straight</strong>
              <small>Casual · Both keep pts</small>
            </button>
          </div>
        </div>

        <!-- Win / Bust Rule -->
        <div class="field-group">
          <span class="field-label">Win Rule</span>
          <div class="segmented-row two-col">
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.rules.bustRule === 'none' }"
              @click="form.rules.bustRule = 'none'"
            >
              <strong>{{ form.rules.targetScore }}+ Wins</strong>
              <small>Official ACL · No bust</small>
            </button>
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.rules.bustRule === 'exact' }"
              @click="form.rules.bustRule = 'exact'"
            >
              <strong>Exact {{ form.rules.targetScore }}</strong>
              <small>Over busts to {{ computedBustScore }}</small>
            </button>
          </div>
        </div>

        <!-- Starting Honors -->
        <div class="field-group">
          <span class="field-label">Frame 1 Honors (Throws First)</span>
          <div class="segmented-row two-col">
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.startingHonors === 'A' }"
              @click="form.startingHonors = 'A'"
            >
              {{ form.teamA.name || 'Team A' }}
            </button>
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': form.startingHonors === 'B' }"
              @click="form.startingHonors = 'B'"
            >
              {{ form.teamB.name || 'Team B' }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="btn-save">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { TEAM_COLORS } from '../utils/scoring'

export default {
  name: 'GameSettingsModal',
  props: {
    teamA: {
      type: Object,
      required: true,
    },
    teamB: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    startingHonors: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      colors: TEAM_COLORS,
      form: {
        teamA: { name: this.teamA.name, color: this.teamA.color },
        teamB: { name: this.teamB.name, color: this.teamB.color },
        rules: { ...this.rules },
        startingHonors: this.startingHonors,
      },
    }
  },
  computed: {
    computedBustScore() {
      const target = this.form.rules.targetScore
      if (target === 21) return 15
      if (target === 15) return 11
      return 7
    },
  },
  methods: {
    setTargetScore(score) {
      this.form.rules.targetScore = score
      if (score === 21) this.form.rules.bustScore = 15
      else if (score === 15) this.form.rules.bustScore = 11
      else this.form.rules.bustScore = 7
    },
    swapTeams() {
      const prevA = { ...this.form.teamA }
      this.form.teamA = { ...this.form.teamB }
      this.form.teamB = prevA
    },
    save() {
      this.$emit('save', {
        teamA: {
          name: this.form.teamA.name || 'Team A',
          color: this.form.teamA.color,
        },
        teamB: {
          name: this.form.teamB.name || 'Team B',
          color: this.form.teamB.color,
        },
        rules: {
          ...this.form.rules,
          bustScore: this.computedBustScore,
        },
        startingHonors: this.form.startingHonors,
      })
    },
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 100;
}

.modal-sheet {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.28);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 2;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-primary);
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.swap-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 7px;
  cursor: pointer;
}

.swap-btn:hover {
  background: #f1f5f9;
}

.text-input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: inherit;
}

.text-input:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.color-swatches {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.swatch-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.swatch-btn:hover {
  transform: scale(1.08);
}

.swatch-btn.is-selected {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0f172a;
  transform: scale(1.08);
}

.divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 2px 0;
}

.segmented-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.segmented-row.two-col {
  grid-template-columns: repeat(2, 1fr);
}

.seg-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px 8px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #334155;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.seg-btn small {
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
}

.seg-btn.is-active {
  border-color: #0f172a;
  background: #0f172a;
  color: #ffffff;
}

.seg-btn.is-active small {
  color: #cbd5e1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
}

.btn-cancel {
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: #ffffff;
  color: var(--text-secondary);
  font-weight: 700;
  cursor: pointer;
}

.btn-save {
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  border: none;
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.btn-save:hover {
  background: #1e293b;
}
</style>
