# Architecture — tracker

Strait of Hormuz Oil Tanker Tracking System

Last updated: 2026-03-31

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
     ▼
  Browser
     │  ├─ Parse + render Leaflet markers
     │  └─ POST /api/log-position (fetch)
                    │
                    ▼
         Vercel Serverless Function
                    │
                    ▼
             Supabase Postgres
             vessel_positions table
```

API key moves to `.env` → Vercel environment variables. Never in source code from V1 onward.

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
├── initMap()          — center 26°N 56.5°E zoom 8
├── connectWebSocket() — open wss://stream.aisstream.io/v0/stream
├── onMessage()        — parse JSON, route by MessageType
├── updateMarker()     — add or reposition Leaflet marker by MMSI
└── getColor()         — ShipType code → marker color (red/blue/gray)
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
| 2026-03-31 | Supabase (V2) | Vercel Postgres, PlanetScale | Existing account, generous free tier |
