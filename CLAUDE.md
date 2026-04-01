# tracker — Strait of Hormuz Oil Tanker Tracking System

Real-time AIS vessel tracking map for the Strait of Hormuz. Live vessel positions via WebSocket, visualized on an interactive Leaflet map.

## Stack

| Layer | Technology |
|---|---|
| Frontend | HTML + Vanilla JS (MVP) → React (V2) |
| Map | Leaflet.js + OpenStreetMap tiles |
| Data Feed | AISstream WebSocket API |
| Backend | Node.js serverless (V1+) |
| Database | Supabase Postgres (V2) |
| Hosting | Vercel |
| Secrets | .env → Vercel environment variables |

## Key Constants

```
WebSocket endpoint:  wss://stream.aisstream.io/v0/stream
Bounding box:        SW [12, 32] → NE [37, 63]  (lat/lon)
Map center:          26°N, 56.5°E, zoom 8
```

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

## Environment Variables

```
AISSTREAM_API_KEY=     # required from MVP V1 onward
PORT=3000              # V1+
SUPABASE_URL=          # V2+
SUPABASE_ANON_KEY=     # V2+
```

Never commit `.env`. Use `.env.example` for key names only.

## AISstream Message Format

Subscribe with a bounding box filter:
```json
{
  "APIKey": "<key>",
  "BoundingBoxes": [[[24, 54], [28, 60]]],
  "FilterMessageTypes": ["PositionReport", "ShipStaticData"]
}
```

Incoming `PositionReport` fields used:
- `UserID` → MMSI
- `Latitude`, `Longitude` → map position
- `Sog` → speed over ground (knots)
- `Cog` → course over ground (degrees)
- `TrueHeading` → vessel heading
- `ShipName`, `Destination`, `ShipType` → from `ShipStaticData` messages

## Vessel Marker Colors

| Type | Color |
|---|---|
| Tanker (80–89) | Red |
| Cargo (70–79) | Blue |
| Other | Gray |

## Current Phase

**MVP — Planning** — single `index.html`, browser-direct WebSocket, no backend.

See `tracker.md` (symlinked Obsidian project plan) for full milestone definitions and build log.

## Docs

Update files in `docs/` after every major milestone.

| File | Purpose |
|---|---|
| `docs/project_spec.md` | Full requirements and tech details |
| `docs/architecture.md` | System design and data flow |
| `docs/changelog.md` | Version history |
| `docs/project_status.md` | Current progress and blockers |

When making git commits, use the `/update-docs-and-commit` slash command to ensure docs are current before committing.

## Architecture Decision

Live WebSocket stays browser-direct through V2 to avoid Vercel's 10s serverless timeout. The Node backend (V1+) is logging-only via `POST /api/log-position` — it is not a relay.

## Out of Scope

- User auth
- Military/government vessel tracking
- Predictive routing or ML
- Mobile app
- Raw NMEA decoding
- Paid AIS feeds

## References

- AISstream docs: https://aisstream.io/documentation
- Leaflet.js docs: https://leafletjs.com/reference.html
- AIS vessel type codes: https://www.maritec.co.za/tools/aisvdmvdodecoding/
- Supabase docs: https://supabase.com/docs
- Vercel env vars: https://vercel.com/docs/environment-variables
