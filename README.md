# Cornhole Pro — Frame Scorekeeper

A modern Vue 3 scorekeeping app for cornhole built around official **ACL frame-by-frame cancellation scoring**, live pro statistics, and mobile-first styling.

Live site: https://dansface.github.io/cornhole-scoring/

## Features

- **Pro Frame Scoring**: Track each team's 4 bags per frame — In the Hole (+3 Cornhole), On the Board (+1 Woody), and Off/Miss (0) — with automatic **cancellation scoring** and real-time frame previews (`MATCH POINT`, `BUST!`, and `WIN BY 2` indicators).
- **Honors Tracking**: Automatically tracks which team throws first each frame based on the previous frame's winner (preserving honors on a Wash).
- **Configurable Rules**: Play official **ACL First to 21+**, enable **Win by 2**, or use backyard **Exact 21 (Bust to 15)**, customize target scores (11, 15, 21), and switch between Cancellation and Straight scoring.
- **Built-in Rules Guide**: Quick-reference modal (`? Rules`) explaining frames, cancellation math, honors, and PPR.
- **Custom Teams & Bag Colors**: Rename teams, swap sides, and choose from 8 high-contrast bag colors.
- **Frame Sheet & Undo/Edit**: View a full frame-by-frame box score, undo the last frame (restoring its bags for quick edits), or edit any previous frame with automatic recalculation.
- **Pro Match Stats**: Live **PPR (Points Per Round)**, In-Hole %, Board % (In + On), total Cornholes/Woodies, and **Four-Baggers** (12-point frames).
- **Auto-Save & Match History**: Active matches and the last 20 completed games save automatically to `localStorage`.

## Project Structure

- `src/utils/scoring.js` — Pure frame scoring engine (cancellation/straight math, bust & Win by 2 rules, deterministic game replay, and pro stats)
- `src/utils/storage.js` — `localStorage` persistence for active games, settings, and match history
- `src/views/Game.vue` — Top-level match orchestrator and modal state
- `src/components/` — Scoreboard, 4-bag frame cards (`TeamFrameCard`, `FrameScorer`), `FrameHistory` (Frame Sheet / Pro Stats / Past Games), `WinnerBanner`, `GameSettingsModal`, and `RulesModal`

## Local Development

### Install dependencies

```bash
npm install
```

### Run the Vue dev server (`http://localhost:8080`)

```bash
npm run serve
```

### Build for production (`dist/`)

```bash
npm run build
```

> **Node.js 18+ Note**: Because this project uses Vue CLI 4 / Webpack 4, `npm run serve` and `npm run build` automatically pass `--openssl-legacy-provider` to Node in `package.json` for OpenSSL 3 compatibility. On Windows, if PowerShell's execution policy blocks `npm.ps1`, run commands in Git Bash or use `npm.cmd`.

## Deploying to GitHub Pages

Production builds use `publicPath: "/cornhole-scoring/"` (configured in `vue.config.js`). After building `dist/`:

```bash
npm run build
git add -f dist
git commit -m "Build dist for GitHub Pages"
git subtree push --prefix dist origin gh-pages
```
