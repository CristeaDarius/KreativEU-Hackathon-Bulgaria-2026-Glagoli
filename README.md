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

2. Run the setup script:
   ```bash
   ./setup.sh
   ```
   This installs dependencies and creates a `.env` file from `.env.example`.

3. Update `.env` with your values.

4. Start the dev server and backend in separate terminals:
   ```bash
   npm run dev       # frontend on http://localhost:5173
   npm run server    # backend on http://localhost:3001
   ```

## Data

### places.csv

Located at the root of the project. This is the main data file.

Columns:

| Column | Description |
|--------|-------------|
| `name` | Display name of the place |
| `why_and_how_it_will_work` | Why it's relevant and how it will work |
| `id` | Unique text identifier, use underscores (e.g. `the_donors_monument`) |
| `additional_info` | Any extra info |
| `latitude` | Latitude coordinate |
| `longitude` | Longitude coordinate |

Example row:
```
name,why_and_how_it_will_work,id,additional_info,latitude,longitude
The Donors Monument,"local identity, civic culture",the_donors_monument,Near the center,42.6977,23.3219
```

### descriptions/

Each place can have a long-form description stored as a plain text file named `<id>.txt` (e.g. `descriptions/the_donors_monument.txt`). Edit these files directly in the IDE. The server reads them automatically on every request.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_MISTRAL_API_KEY` | Mistral API key |
| `VITE_MISTRAL_MODEL` | Mistral model (default: `ministral-8b-latest`) |
| `SERVER_PORT` | Backend port (default: `3001`) |
| `VITE_SERVER_URL` | Backend URL used by the frontend |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run server` | Start backend server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
