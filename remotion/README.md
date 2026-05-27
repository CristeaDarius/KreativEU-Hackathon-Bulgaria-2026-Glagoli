# LocAIa Remotion Promo

This folder contains a self-contained 45-second Remotion promo video for LocAIa. It uses local mock data and simplified product UI, so rendering does not require the app backend or external APIs.

## Preview

Run:

```bash
npm run video:preview
```

This opens Remotion Studio for the `LocaiaPromo` composition at 1920x1080, 30 FPS.

## Render MP4

Run:

```bash
npm run video:render
```

The MP4 renders to:

```text
out/locaia-promo.mp4
```

## Edit Scenes

Scene files live in:

```text
remotion/scenes/
```

The main scene timeline is in:

```text
remotion/LocaiaPromo.tsx
```

Reusable animation components live in:

```text
remotion/components/
```

## Edit Text And Colors

Route stops, captions, and brand colors live in:

```text
remotion/data/routeData.ts
```

Global video CSS variables live in:

```text
remotion/styles.css
```

The voiceover script lives in:

```text
remotion/voiceover-script.md
```
