# Changelog — tracker

Strait of Hormuz Oil Tanker Tracking System

All notable changes documented here. Format: `[phase] — YYYY-MM-DD`

---

## [Unreleased — MVP]

### Planned
- `index.html` with Leaflet map centered on Strait of Hormuz (26°N, 56.5°E, zoom 8)
- AISstream WebSocket connection (`wss://stream.aisstream.io/v0/stream`)
- Bounding box filter: SW [24, 54] → NE [28, 60]
- Live vessel markers color-coded by AIS vessel type
- Browser-direct, no backend, no install required

---

## [Unreleased — V1]

### Planned
- Vessel click → sidebar telemetry (name, MMSI, speed, heading, destination, type, flag)
- Filter buttons: All / Tanker / Cargo / Other
- API key secured in `.env` → Vercel environment variables
- Node.js project scaffold
- Vercel deployment
- README.md

---

## [Unreleased — V2]

### Planned
- Supabase `vessel_positions` table for position history
- `POST /api/log-position` serverless function
- Historical playback slider (last 24 hours)
- Vessel trail/wake polyline

---

## [Planning] — 2026-03-31

### Added
- Project plan completed in Obsidian
- Stack selected: Leaflet.js · AISstream · Node.js (V1) · Supabase (V2) · Vercel
- Bounding box confirmed: SW [24, 54] → NE [28, 60]
- Map center confirmed: 26°N, 56.5°E, zoom 8
- WebSocket endpoint confirmed: `wss://stream.aisstream.io/v0/stream`
- Architecture decision: WebSocket stays browser-direct through V2 (Vercel 10s timeout constraint)
- `CLAUDE.md` created at repo root
- `docs/` folder initialized with spec, architecture, changelog, and status
- `.env.example` keys defined: `AISSTREAM_API_KEY`, `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### Pending
- AISstream account creation and API key
- GitHub repo creation (`tracker`)
