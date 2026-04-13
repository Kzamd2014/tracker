# tracker

Real-time AIS vessel tracking map covering the Persian Gulf, Strait of Hormuz, Gulf of Oman, and Arabian Sea. Live vessel positions stream via WebSocket and are plotted on an interactive map — no install required.

**Live:** https://tracker-sable-phi.vercel.app

---

## What it does

- Connects directly to [AISstream](https://aisstream.io) and streams live vessel position reports
- Plots each vessel as a color-coded dot on a dark Leaflet map
- Smoothly animates vessel movement with a pulse ring on each update
- Removes vessels that haven't reported in 15 minutes
- Reconnects automatically on WebSocket drop

**Vessel colors:**

| Type | AIS Code | Color |
|---|---|---|
| Tanker | 80–89 | Red |
| Cargo | 70–79 | Blue |
| Other | — | Gray |

---

## Coverage

Bounding box: **SW [5°N, 48°E] → NE [30°N, 78°E]**

Covers the Persian Gulf, Strait of Hormuz, Gulf of Oman, and Arabian Sea.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | HTML + Vanilla JS |
| Map | Leaflet.js + CartoDB dark tiles |
| Data | AISstream WebSocket API |
| Backend | Node.js on Vercel (API key endpoint only) |
| Hosting | Vercel |

---

## Running locally

```bash
npm install
cp .env.example .env   # add your AISstream API key
npm run dev
```

Then open `http://localhost:3000`.

Get a free API key at [aisstream.io](https://aisstream.io).

---

## Deploying

```bash
vercel --prod
```

Set `AISSTREAM_API_KEY` in the Vercel dashboard under Environment Variables before deploying.

---

## Architecture note

The WebSocket connection is browser-direct — the browser connects straight to AISstream. This is intentional: Vercel serverless functions have a 10-second timeout and can't hold a persistent connection. The Node backend only serves the API key via `GET /api/key`.

---

## Roadmap

- **V1 (next):** Vessel telemetry sidebar on click, filter by vessel type
- **V2:** Supabase position logging, historical playback slider, vessel trail lines
