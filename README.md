# Glagoli

Project made for the KreativEU Hackathon held in Bulgaria 2026.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the env file and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173`. The backend API runs at `http://localhost:3001` — you don't need to open that directly, the frontend proxies all `/api` requests to it automatically.

## Data

### places.csv

Located at the root of the project. Edit it directly in your IDE or any spreadsheet tool.

| Column | Description |
|--------|-------------|
| `name` | Display name of the place |
| `why_and_how_it_will_work` | Why it's relevant and how it will work |
| `id` | Unique text identifier, use underscores (e.g. `the_donors_monument`) |
| `additional_info` | Any extra info |
| `latitude` | Latitude coordinate |
| `longitude` | Longitude coordinate |

### descriptions/

Each place can have a long-form description as `descriptions/<id>.txt`. Edit these directly in the IDE — the server reads them on every request.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_MISTRAL_API_KEY` | Mistral API key |
| `VITE_MISTRAL_MODEL` | Mistral model (default: `ministral-8b-latest`) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend together |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run video:preview` | Open Remotion Studio for the LocAIa promo video |
| `npm run video:render` | Render `out/locaia-promo.mp4` |

## Remotion Promo Video

The LocAIa 45-second promo video lives in `remotion/`. It is a TypeScript Remotion setup with reusable animated components and local mock data, so it renders without the backend or external APIs.

Preview the video:

```bash
npm run video:preview
```

Render the MP4:

```bash
npm run video:render
```

The rendered file is written to `out/locaia-promo.mp4`.

Edit scenes in `remotion/scenes/`. Edit the timeline in `remotion/LocaiaPromo.tsx`. Edit captions, route stops, and colors in `remotion/data/routeData.ts` and `remotion/styles.css`. The voiceover script is in `remotion/voiceover-script.md`.
