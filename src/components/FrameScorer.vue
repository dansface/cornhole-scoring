<template>
  <section class="scorer-section" aria-label="Current Frame Scoring">
    <div v-if="editingFrameNumber !== null" class="editing-banner">
      <span>
        Editing <strong>Frame {{ editingFrameNumber }}</strong> — adjust bags below and save changes
      </span>
      <button type="button" class="banner-cancel-btn" @click="$emit('cancel-edit')">
        Cancel
      </button>
    </div>

    <div class="scorer-grid">
      <TeamFrameCard
        :team="teamA"
        :bags="draftBagsA"
        :hasHonors="activeHonors === 'A'"
        :disabled="disabled"
        @update-bags="$emit('update-draft-a', $event)"
      />

      <TeamFrameCard
        :team="teamB"
        :bags="draftBagsB"
        :hasHonors="activeHonors === 'B'"
        :disabled="disabled"
        @update-bags="$emit('update-draft-b', $event)"
      />
    </div>

    <div class="scorer-actions">
      <div class="secondary-actions">
        <button
          type="button"
          class="btn-secondary"
          :disabled="disabled || isDraftEmpty"
          @click="$emit('clear-draft')"
        >
          Clear Bags
        </button>

        <button
          v-if="editingFrameNumber === null"
          type="button"
          class="btn-secondary"
          :disabled="!canUndo"
          title="Undo the last submitted frame"
          @click="$emit('undo-frame')"
        >
          Undo Last
        </button>
      </div>

      <button
        type="button"
        class="btn-submit"
        :disabled="disabled"
        :style="submitButtonStyle"
        @click="$emit('submit-frame')"
      >
        <span class="submit-main">{{ submitMainLabel }}</span>
        <span class="submit-pill">{{ submitOutcomePill }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import TeamFrameCard from './TeamFrameCard'

export default {
  name: 'FrameScorer',
  components: {
    TeamFrameCard,
  },
  props: {
    teamA: {
      type: Object,
      required: true,
    },
    teamB: {
      type: Object,
      required: true,
    },
    draftBagsA: {
      type: Object,
      required: true,
    },
    draftBagsB: {
      type: Object,
      required: true,
    },
    activeHonors: {
      type: String,
      required: true,
    },
    currentFrameNumber: {
      type: Number,
      required: true,
    },
    editingFrameNumber: {
      type: Number,
      default: null,
    },
    preview: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    canUndo: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update-draft-a',
    'update-draft-b',
    'clear-draft',
    'undo-frame',
    'submit-frame',
    'cancel-edit',
  ],
  computed: {
    isDraftEmpty() {
      return (
        this.draftBagsA.inHole === 0 &&
        this.draftBagsA.onBoard === 0 &&
        this.draftBagsB.inHole === 0 &&
        this.draftBagsB.onBoard === 0
      )
    },
    submitMainLabel() {
      if (this.editingFrameNumber !== null) {
        return `Save Frame ${this.editingFrameNumber}`
      }
      return `Complete Frame ${this.currentFrameNumber}`
    },
    submitOutcomePill() {
      if (this.rules.scoringMode === 'straight') {
        return `+${this.preview.netA} / +${this.preview.netB}`
      }
      if (this.preview.frameWinner === 'A') {
        return `${this.teamA.name} +${this.preview.netA}`
      }
      if (this.preview.frameWinner === 'B') {
        return `${this.teamB.name} +${this.preview.netB}`
      }
      return 'Wash (0)'
    },
    submitButtonStyle() {
      if (this.editingFrameNumber !== null) {
        return { '--submit-bg': '#0f172a' }
      }
      if (this.preview.frameWinner === 'A') {
        return { '--submit-bg': this.teamA.color }
      }
      if (this.preview.frameWinner === 'B') {
        return { '--submit-bg': this.teamB.color }
      }
      return { '--submit-bg': '#0f172a' }
    },
  },
}
</script>

<style scoped>
.scorer-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editing-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
  font-size: 0.85rem;
}

.banner-cancel-btn {
  background: #ffffff;
  border: 1px solid #f59e0b;
  color: #92400e;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 8px;
  cursor: pointer;
}

.banner-cancel-btn:hover {
  background: #fffbeb;
}

.scorer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.scorer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.secondary-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  height: 46px;
  padding: 0 15px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--surface-card);
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #f1f5f9;
  color: var(--text-primary);
}

.btn-secondary:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-submit {
  flex: 1;
  min-width: 220px;
  min-height: 54px;
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  background: var(--submit-bg, #0f172a);
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
  transition: transform 0.1s ease, filter 0.15s ease, background 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  filter: brightness(1.07);
}

.btn-submit:active:not(:disabled) {
  transform: scale(0.985);
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.submit-main {
  font-family: var(--font-display);
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.submit-pill {
  background: rgba(255, 255, 255, 0.22);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 185px;
}

@media (max-width: 680px) {
  .scorer-grid {
    grid-template-columns: 1fr;
  }

  .scorer-actions {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 10px;
  }

  .btn-submit {
    flex: none;
    width: 100%;
    min-width: 0;
    min-height: 64px;
    padding: 15px 20px;
    border-radius: 16px;
  }

  .submit-main {
    font-size: 1.32rem;
  }

  .submit-pill {
    font-size: 0.9rem;
    padding: 6px 13px;
  }

  .secondary-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .btn-secondary {
    height: 48px;
  }
}
</style>
