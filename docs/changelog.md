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
- GitHub repo created: https://github.com/Kzamd2014/tracker

### Fixed (spec review)
- `FilterMessageTypes` corrected to include `ShipStaticData` (required for vessel color-coding and V1 sidebar fields)
- V1/V2 Supabase discrepancy resolved: Supabase and `POST /api/log-position` are V2-only; removed from V1 architecture diagram
- Vessel store data structure defined: `Map<string, {marker, data, lastSeen}>` keyed by MMSI
- Coordinate validation added to MVP spec: reject lat==0&&lon==0, |lat|>90, |lon|>180
- Marker TTL (15 min) and cleanup interval (60s) added to MVP spec
- Auto-reconnect on `onclose`/`onerror` (3s delay) added to MVP spec
- Connection status indicator added to MVP spec: "Connecting…" / "Live — N vessels" / "Disconnected"
- Flag data source specified for V1: derived from MMSI prefix using MID country code lookup
- API key git safety note added to MVP checklist in project_status.md

### Pending
- AISstream account creation and API key
- Verify Chrome allows `wss://` connection from `file://` origin
