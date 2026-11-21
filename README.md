# Cornhole Pro — Frame Scorekeeper

A modern Vue 3 scorekeeping app for cornhole built around official **ACL frame-by-frame cancellation scoring**, live pro statistics, and mobile-first styling.

Hosted at https://dansface.github.io/cornhole-scoring/

## Features

- **Pro Frame Scoring**: Track each team's 4 bags per frame — In the Hole (+3 Cornhole), On the Board (+1 Woody), and Off/Miss (0) — with automatic **cancellation scoring** and real-time frame previews.
- **Honors Tracking**: Automatically tracks which team throws first each frame based on the previous frame's winner (preserving honors on a Wash).
- **Configurable Rules**: Play official **ACL First to 21+** or backyard **Exact 21 (Bust to 15)**, customize target scores (11, 15, 21), or switch between Cancellation and Straight scoring.
- **Custom Teams & Bag Colors**: Rename teams and choose from 8 high-contrast bag colors.
- **Frame Sheet & Undo/Edit**: View a full frame-by-frame box score, undo the last frame, or edit any previous frame with automatic score recalculation.
- **Pro Match Stats**: Live **PPR (Points Per Round)**, In-Hole %, Board %, total Cornholes/Woodies, and **Four-Baggers** (12-point frames).
- **Auto-Save & Match History**: Active matches and completed game results are saved automatically to `localStorage`.

## Project Setup

```bash
npm install
```

## Run the Vue dev server (http://localhost:8080)

```bash
npm run serve
```

## Compiles and minifies for production

```bash
npm run build
```
