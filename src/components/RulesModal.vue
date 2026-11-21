<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="rules-title" @click.self="$emit('close')">
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 id="rules-title" class="modal-title">How Pro Cornhole Frames Work</h2>
        <button type="button" class="close-btn" aria-label="Close rules" @click="$emit('close')">
          ×
        </button>
      </div>

      <div class="modal-body">
        <div class="rule-block">
          <h3>1. Four Bags Per Frame</h3>
          <p>
            A cornhole game is played in rounds called <strong>frames</strong> (or innings).
            Each team alternates throwing <strong>4 bags</strong> per frame (8 bags total).
          </p>
          <div class="point-pills">
            <span class="pill pill-hole"><strong>3 pts</strong> · In the Hole (Cornhole)</span>
            <span class="pill pill-board"><strong>1 pt</strong> · On the Board (Woody)</span>
            <span class="pill pill-miss"><strong>0 pts</strong> · Off the Board</span>
          </div>
        </div>

        <div class="rule-block">
          <h3>2. Cancellation Scoring</h3>
          <p>
            After all 8 bags are thrown, each team's raw frame points cancel each other out.
            Only the higher-scoring team earns the difference for that frame.
          </p>
          <div class="example-box">
            <div class="example-row">
              <span><strong>Team A:</strong> 2 in hole + 1 on board</span>
              <span class="ex-pts">7 raw pts</span>
            </div>
            <div class="example-row">
              <span><strong>Team B:</strong> 1 in hole + 2 on board</span>
              <span class="ex-pts">5 raw pts</span>
            </div>
            <div class="example-result">
              Result: 7 − 5 = <strong>Team A earns +2 pts</strong> (Team B earns 0)
            </div>
          </div>
          <p class="rule-note">
            If both teams score the same raw points, the frame is a <strong>Wash (0 pts)</strong>.
          </p>
        </div>

        <div class="rule-block">
          <h3>3. Honors (Who Throws First)</h3>
          <p>
            Whichever team scored points in the previous frame earns <strong>Honors</strong> and
            throws first in the next frame. On a Wash, throwing order stays the same.
          </p>
        </div>

        <div class="rule-block">
          <h3>4. Winning &amp; Pro Stats</h3>
          <p>
            In official ACL rules, the first team to reach <strong>21 or more points</strong> at
            the end of a frame wins (no busting). Prefer backyard rules? Switch to
            <strong>Exact 21 (Bust to 15)</strong> anytime in Settings.
          </p>
          <p class="rule-note">
            <strong>PPR (Points Per Round)</strong> measures your average raw points per frame
            (max 12.00 — landing all 4 bags in the hole is a <strong>Four-Bagger</strong>!).
          </p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-got-it" @click="$emit('close')">
            Got It
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RulesModal',
  emits: ['close'],
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
  max-width: 500px;
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

.modal-body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-block h3 {
  font-size: 0.94rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.rule-block p {
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.rule-note {
  margin-top: 6px;
  font-size: 0.82rem !important;
  color: var(--text-muted) !important;
}

.point-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 9px;
}

.pill {
  font-size: 0.76rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
}

.pill-hole {
  background: #fef3c7;
  color: #92400e;
}

.pill-board {
  background: #eff6ff;
  color: #1e40af;
}

.pill-miss {
  background: #f1f5f9;
  color: #475569;
}

.example-box {
  margin-top: 9px;
  padding: 11px 13px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.82rem;
}

.example-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--text-secondary);
}

.ex-pts {
  font-weight: 700;
  color: var(--text-primary);
}

.example-result {
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px dashed #cbd5e1;
  color: #0f172a;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

.btn-got-it {
  height: 42px;
  padding: 0 22px;
  border-radius: 10px;
  border: none;
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.btn-got-it:hover {
  background: #1e293b;
}
</style>
