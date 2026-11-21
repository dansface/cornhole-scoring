<template>
  <header class="app-header">
    <div class="brand">
      <div class="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="6"
            y="2.5"
            width="20"
            height="27"
            rx="3.5"
            fill="currentColor"
            fill-opacity="0.14"
            stroke="currentColor"
            stroke-width="2"
          />
          <circle cx="16" cy="10.5" r="3.6" fill="currentColor" />
          <rect x="11" y="20" width="4.5" height="4.5" rx="1.2" fill="#f59e0b" />
          <rect x="16.8" y="18.5" width="4.5" height="4.5" rx="1.2" fill="#ef4444" />
        </svg>
      </div>
      <div class="brand-text">
        <h1 class="brand-title">{{ title }}</h1>
        <span class="brand-subtitle">ACL Frame Scoring</span>
      </div>
    </div>

    <div class="header-actions">
      <button
        type="button"
        class="icon-btn"
        title="How frames & scoring work"
        aria-label="How frames and scoring work"
        @click="$emit('open-rules')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span class="btn-label">Rules</span>
      </button>

      <button
        type="button"
        class="icon-btn"
        title="Teams & game settings"
        aria-label="Teams and game settings"
        @click="$emit('open-settings')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
        <span class="btn-label">Settings</span>
      </button>

      <button
        type="button"
        class="icon-btn icon-btn-accent"
        title="Start a new game"
        aria-label="Start a new game"
        @click="$emit('new-game')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        <span class="btn-label">New Game</span>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: 'Cornhole Pro',
    },
  },
  emits: ['open-rules', 'open-settings', 'new-game'],
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 0 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
}

.brand-icon svg {
  width: 24px;
  height: 24px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.05;
  color: var(--text-primary);
  text-transform: uppercase;
}

.brand-subtitle {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--surface-card);
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.icon-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: #f8fafc;
  color: var(--text-primary);
  border-color: #cbd5e1;
}

.icon-btn:active {
  transform: scale(0.97);
}

.icon-btn-accent {
  background: #0f172a;
  color: #f8fafc;
  border-color: #0f172a;
}

.icon-btn-accent:hover {
  background: #1e293b;
  color: #ffffff;
  border-color: #1e293b;
}

@media (max-width: 540px) {
  .icon-btn {
    padding: 0 10px;
  }

  .btn-label {
    display: none;
  }

  .brand-title {
    font-size: 1.25rem;
  }
}
</style>
