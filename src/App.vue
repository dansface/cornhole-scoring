<template>
  <div class="app-wrapper">
    <Game />
    <Footer />
  </div>
</template>

<script>
import Game from './views/Game'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Game,
    Footer,
  },
}
</script>

<style>
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Barlow Condensed', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --bg-page: #f1f5f9;
  --surface-card: #ffffff;
  --border-color: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  background: radial-gradient(circle at top center, #ffffff 0%, var(--bg-page) 55%);
  background-attachment: fixed;
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.45;
}

button,
input {
  font-family: inherit;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.app-wrapper {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 0 16px 36px;
}

@media (max-width: 540px) {
  .app-wrapper {
    padding: 0 12px 28px;
  }
}
</style>
