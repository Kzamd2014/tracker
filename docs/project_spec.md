# Project Spec — tracker

Strait of Hormuz Oil Tanker Tracking System

Last updated: 2026-04-01 (revised)

---

## Purpose

tracker is a real-time vessel monitoring tool that visualizes oil tanker traffic through the Strait of Hormuz using publicly broadcast AIS data. It makes geopolitically significant maritime data visible without requiring expensive commercial subscriptions.

## Target Users

- Maritime analysts and researchers
- Journalists covering geopolitics and energy supply chains
- Technically curious users interested in vessel traffic patterns
- Portfolio demonstration of real-time data visualization

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | HTML + Vanilla JS (MVP) → React (V2) | No build tools for MVP — just open in browser |
| Map | Leaflet.js + OpenStreetMap tiles | Free, no token required |
| Data Feed | AISstream WebSocket API | Free tier, filter by bounding box |
| Backend | Node.js serverless (V1+) | Vercel serverless for logging endpoint only |
| Database | Supabase Postgres (V2) | Position history, free tier |
| Hosting | Vercel | Auto-deploy from main branch |
| Secrets | .env → Vercel environment variables | API key never in source code from V1 |

---

## Key Constants

```
WebSocket endpoint:  wss://stream.aisstream.io/v0/stream
Bounding box:        SW [12, 32] → NE [37, 63]  (lat/lon)
Map center:          26°N, 56.5°E, zoom 8
```

---

## Functional Requirements

### MVP
- Single `index.html` — no install, open in browser
- Leaflet map centered on Strait of Hormuz (26°N, 56.5°E, zoom 8)
- WebSocket connection to AISstream (`wss://stream.aisstream.io/v0/stream`)
- Bounding box filter: SW [24, 54] → NE [28, 60]
- Parse `PositionReport` messages and plot/update Leaflet circle markers
- Color markers by vessel type: tanker = red, cargo = blue, other = gray
- Reject invalid coordinates: skip any position where `Latitude == 0 && Longitude == 0`, `Latitude > 90`, or `Longitude > 180`
- Markers expire after 15 minutes without a position update (removed from map)
- Connection status indicator: one-line text showing "Connecting…", "Live — N vessels", or "Disconnected"
- Reconnect on close: automatic retry with 3-second delay on `onclose` / `onerror`
- At least one vessel visible and updating within 2 minutes of load

### V1
- Vessel click → sidebar panel: name, MMSI, speed, heading, destination, vessel type, flag (derived from MMSI prefix using MID country code lookup)
- Filter toggle buttons: All / Tanker / Cargo / Other
- API key moved from source to `.env` → Vercel environment variables
- Node.js project scaffold: `package.json`, `.gitignore`, `.env.example`
- Vercel deployment configured
- `README.md` with setup instructions

### V2
- Supabase table: `vessel_positions (mmsi, lat, lon, speed, heading, timestamp)`
- Vercel serverless function: `POST /api/log-position`
- Frontend calls log endpoint on each position update
- Historical playback slider (last 24 hours)
- Vessel wake/trail line showing recent path

### Later (not prioritized)
- Multi-region support
- Mobile responsive layout
- Vessel photo lookup
- Export to CSV

---

## Out of Scope

- User auth
- Military/government vessel tracking
- Predictive routing or ML
- Mobile app
- Raw NMEA decoding
- Paid AIS feeds

---

## AISstream Integration

**Subscribe payload:**
```json
{
  "APIKey": "<key>",
  "BoundingBoxes": [[[24, 54], [28, 60]]],
  "FilterMessageTypes": ["PositionReport", "ShipStaticData"]
}
```

**Fields consumed from `PositionReport`:**

| Field | Usage |
|---|---|
| `UserID` | MMSI identifier |
| `Latitude` / `Longitude` | Map position |
| `Sog` | Speed over ground (knots) |
| `Cog` | Course over ground (degrees) |
| `TrueHeading` | Vessel orientation |

**Fields consumed from `ShipStaticData`:**

| Field | Usage |
|---|---|
| `ShipName` | Display name |
| `Destination` | Sidebar telemetry |
| `ShipType` | Marker color logic |

---

## WebSocket Connection Behavior

| Event | Behavior |
|---|---|
| Connecting | Status indicator shows "Connecting…" |
| `onopen` | Send subscribe payload; status shows "Live — 0 vessels" |
| `onmessage` | Parse and dispatch by `MessageType`; increment vessel counter on new MMSI |
| `onerror` | Log to console; status shows "Disconnected" |
| `onclose` | Status shows "Disconnected"; retry after 3s delay |
| Reconnect | Re-run `connectWebSocket()`; counter resets |

**Coordinate validation:** Reject any `PositionReport` where `Latitude == 0 && Longitude == 0`, `Math.abs(Latitude) > 90`, or `Math.abs(Longitude) > 180`.

**Marker TTL:** Each marker tracks its last-updated timestamp. A cleanup interval (every 60s) removes markers not updated in the last 15 minutes.

---

## Vessel Marker Colors

| Type | AIS Code Range | Color |
|---|---|---|
| Tanker | 80–89 | Red |
| Cargo | 70–79 | Blue |
| Other | All others | Gray |

---

## Environment Variables

| Variable | Phase | Description |
|---|---|---|
| `AISSTREAM_API_KEY` | V1+ | AISstream API key |
| `PORT` | V1+ | Local dev server port (default 3000) |
| `SUPABASE_URL` | V2+ | Supabase project URL |
| `SUPABASE_ANON_KEY` | V2+ | Supabase anon/public key |

Never commit `.env`. Use `.env.example` for key names only.

---

## References

- AISstream docs: https://aisstream.io/documentation
- Leaflet.js docs: https://leafletjs.com/reference.html
- AIS vessel type codes: https://www.maritec.co.za/tools/aisvdmvdodecoding/
- Supabase docs: https://supabase.com/docs
- Vercel env vars: https://vercel.com/docs/environment-variables
