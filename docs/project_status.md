# Project Status — tracker

Strait of Hormuz Oil Tanker Tracking System

Last updated: 2026-04-01 (revised)

---

## Current Phase: MVP — Planning

| | |
|---|---|
| Status | 🌱 Planning |
| GitHub Repo | TBD — create before first commit |
| Live URL | TBD — Vercel deploy after MVP |
| Stack | HTML/JS (MVP) → Node.js + Supabase (V1) · AISstream WebSocket · Leaflet.js |

---

## Key Constants (for reference during build)

```
WebSocket endpoint:  wss://stream.aisstream.io/v0/stream
Bounding box:        SW [24, 54] → NE [28, 60]  (lat/lon)
Map center:          26°N, 56.5°E, zoom 8
```

---

## Phase Progress

### 🟢 MVP
- [x] Project plan completed
- [x] Stack selected
- [x] Architecture decisions logged
- [x] `CLAUDE.md` created
- [x] `docs/` initialized
- [ ] AISstream account and API key obtained
- [x] GitHub repo created (`tracker`) — https://github.com/Kzamd2014/tracker
- [ ] `.gitignore` configured — **must be done before pasting API key into index.html**
- [ ] `index.html` with Leaflet map
- [ ] WebSocket connection to AISstream
- [ ] Bounding box filter active
- [ ] `PositionReport` parsing and marker rendering
- [ ] Vessel type color coding (tanker=red, cargo=blue, other=gray)
- [ ] Live vessels confirmed in browser

**Definition of Done:** Open `index.html` in Chrome with a valid API key, see at least one vessel dot appear and update within 2 minutes.

---

### 🔵 V1
- [ ] Vessel click → telemetry sidebar (name, MMSI, speed, heading, destination, type, flag)
- [ ] Filter buttons: All / Tanker / Cargo / Other
- [ ] API key moved to `.env` / Vercel env vars
- [ ] Node.js scaffold (`package.json`, `.gitignore`, `.env.example`)
- [ ] Vercel deployment configured
- [ ] `README.md` written
- [ ] Live Vercel URL confirmed

**Definition of Done:** Live Vercel URL loads the map, clicking a vessel shows telemetry, filters work, API key not visible in any frontend source.

---

### 🟣 V2
- [ ] Supabase `vessel_positions` table
- [ ] `POST /api/log-position` serverless function
- [ ] Frontend position logging active
- [ ] Historical playback slider (24h)
- [ ] Vessel trail/wake polyline

**Definition of Done:** Positions writing to Supabase in real-time; timeline slider lets users scrub last 24 hours of traffic.

---

## Blockers

| Blocker | Status |
|---|---|
| AISstream API key | Pending — account not yet created |
| file:// + wss:// browser test | Pending — must verify Chrome allows wss:// from file:// before coding MVP |

---

## Environment Variables Status

| Variable | Needed | Configured |
|---|---|---|
| `AISSTREAM_API_KEY` | MVP+ | ☐ |
| `PORT` | V1+ | ☐ |
| `SUPABASE_URL` | V2+ | ☐ |
| `SUPABASE_ANON_KEY` | V2+ | ☐ |

---

## Build Log

| Date | Notes |
|---|---|
| 2026-03-31 | Project plan completed. Stack selected. CLAUDE.md and docs/ created. Awaiting API key and repo setup to begin MVP build. |
| 2026-03-31 | Spec review completed. Critical fixes applied: FilterMessageTypes corrected to include ShipStaticData; coordinate validation, marker TTL, reconnect logic, and connection status indicator added to spec; V1/V2 Supabase discrepancy resolved; vessel store data structure defined in architecture. GitHub repo created. |
