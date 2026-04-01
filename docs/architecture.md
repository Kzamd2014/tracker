# Architecture — tracker

Strait of Hormuz Oil Tanker Tracking System

Last updated: 2026-04-01 (revised)

---

## Key Decision

**Live WebSocket stays browser-direct through V2.** Vercel serverless functions have a 10-second timeout and cannot hold a persistent connection. The Node backend (V1+) is logging-only via `POST /api/log-position` — it is not a relay.

---

## MVP Data Flow

```
AISstream API
     │
     │  WebSocket (wss://stream.aisstream.io/v0/stream)
     │  BoundingBoxes: SW [24, 54] → NE [28, 60]
  FilterMessageTypes: PositionReport + ShipStaticData
     ▼
  Browser
     │
     │  Parse JSON → PositionReport / ShipStaticData
     ▼
Leaflet.js Map
     │
     │  addLayer / setLatLng per MMSI
     ▼
  DOM (index.html)
```

No server involved. API key is in the HTML file (MVP only — moves to env in V1).

---

## V1 Data Flow

```
AISstream API
     │
     │  WebSocket (browser-direct — unchanged from MVP)
     │  FilterMessageTypes: PositionReport + ShipStaticData
     ▼
  Browser
     │  ├─ Parse + render Leaflet markers (vessel sidebar on click)
     │  └─ Filter buttons (All / Tanker / Cargo / Other)
```

API key moves to `.env` → Vercel environment variables. Never in source code from V1 onward.
No Supabase in V1 — logging is a V2 concern.

---

## V2 Additions

```
  Browser
     │
     ├─ Live feed (unchanged — browser WebSocket)
     │
     ├─ POST /api/log-position → Supabase (position history)
     │
     └─ GET /api/history?mmsi=&hours=24 → Supabase query
                    │
                    ▼
         Timeline slider + vessel trail rendering
```

---

## Database Schema (V2)

### `vessel_positions`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Auto-increment PK |
| `mmsi` | text | Vessel identifier |
| `lat` | float8 | Latitude |
| `lon` | float8 | Longitude |
| `speed` | float4 | Speed over ground (knots) |
| `heading` | int2 | True heading (degrees) |
| `timestamp` | timestamptz | Server time of log |

Index on `(mmsi, timestamp)` for playback queries.

---

## Frontend Component Map

### MVP (`index.html`)
```
index.html
├── <script> Leaflet CDN
├── vessels            — Map<string, {marker: L.CircleMarker, data: object, lastSeen: number}>
│                        keyed by MMSI string; source of truth for all vessel state
├── initMap()          — center 26°N 56.5°E zoom 8
├── connectWebSocket() — open wss://stream.aisstream.io/v0/stream; auto-retry on close (3s)
├── onMessage()        — parse JSON, route by MessageType (PositionReport | ShipStaticData)
├── validatePosition() — reject lat==0&&lon==0, |lat|>90, |lon|>180
├── updateMarker()     — upsert Leaflet marker by MMSI; update lastSeen timestamp
├── getColor()         — ShipType code → marker color (red/blue/gray); default gray if unknown
├── cleanupMarkers()   — setInterval 60s: remove markers where lastSeen > 15 min ago
└── statusBar          — DOM text: "Connecting…" | "Live — N vessels" | "Disconnected"
```

### V1 additions
```
├── sidebar panel      — vessel telemetry on marker click
├── filter buttons     — All / Tanker / Cargo / Other
└── logPosition()      — POST to /api/log-position
```

### V2 additions
```
├── timeline slider    — scrub last 24h from Supabase history
└── drawTrail()        — polyline of recent vessel positions
```

---

## Hosting & Infrastructure

| Resource | Provider | Notes |
|---|---|---|
| Frontend + API | Vercel | Auto-deploy from main branch |
| Database | Supabase | Managed Postgres, free tier |
| Map tiles | OpenStreetMap via Leaflet CDN | No token required |
| AIS data | AISstream | Browser WebSocket, free tier |

---

## Running Locally

**MVP (no install):**
```bash
# Paste your API key into index.html, then open directly in browser
open index.html
```

**V1+ (Node backend):**
```bash
npm install
cp .env.example .env   # fill in your API key
npm run dev
```

## Deploying

```bash
vercel --prod
# API key must be set in Vercel dashboard → Environment Variables
```

---

## Decisions Log

| Date | Decision | Rejected | Reason |
|---|---|---|---|
| 2026-03-31 | WebSocket browser-direct | Server relay | Vercel 10s timeout makes relay impractical |
| 2026-03-31 | Leaflet.js | Deck.gl, MapboxGL | No build tools or tokens for MVP |
| 2026-03-31 | Supabase (V2 only) | Vercel Postgres, PlanetScale | Existing account, generous free tier; logging deferred to V2 |
| 2026-03-31 | Subscribe to PositionReport + ShipStaticData | PositionReport only | ShipType (for color) and ShipName/Destination (for V1 sidebar) come from ShipStaticData; PositionReport-only subscription breaks color-coding |
| 2026-03-31 | 15-minute marker TTL + 60s cleanup interval | No cleanup | Prevents ghost vessels accumulating on map during long sessions |
| 2026-03-31 | Auto-reconnect on onclose/onerror (3s delay) | No reconnect | Browser WebSocket drops silently on network blips and tab sleep |
