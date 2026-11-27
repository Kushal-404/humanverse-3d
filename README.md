# HumanVerse 3D

Gesture-controlled 3D anatomy explorer (React + Vite + React Three Fiber + MediaPipe).

## Run
```
npm install
npm run dev
```
Open the printed localhost URL. Camera access works on localhost without HTTPS.

## What works now
- Placeholder body with skin, skeleton and organ layers (toggle in the sidebar)
- Orbit/zoom with the mouse, plus keyboard: arrows rotate, +/- zoom, R reset, P pause, Esc deselect
- Click a structure to highlight it and see its info panel
- Hand gestures: two hands apart/together = zoom, pinch + move sideways = rotate, hold one open palm = pause/resume

## Use a real model (Z-Anatomy etc.)
1. Export a small test selection from Blender as GLB to `public/models/human.glb`.
2. Set `USE_GLB = true` in `src/anatomy/AnatomyScene.jsx`.
3. Make mesh names match `modelMesh` in `src/data/anatomyData.js` and add entries for new structures.
4. Check the license and attribution (CC BY-SA 4.0 plus per-file terms) before sharing publicly.

## Structure
All inputs call `dispatch()` in `src/interaction/InteractionController.js`; gestures never touch Three.js directly.

## Not built yet
Pointing/hover gesture, quizzes, Tailwind, Electron packaging, self-hosted MediaPipe files (currently loaded from CDN).
