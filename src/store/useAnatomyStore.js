import { create } from 'zustand'

export const useAnatomyStore = create((set, get) => ({
  selectedId: null,
  layers: { skin: true, skeleton: true, organs: true },
  paused: false,
  gestureStatus: 'off', // off | loading | ready | error
  gestureMessage: '',
  rotationY: 0,         // model rotation (radians)
  zoomImpulse: 0,       // consumed each frame by CameraRig
  resetTick: 0,

  select: (id) => set({ selectedId: id }),
  toggleLayer: (id) => set((s) => ({ layers: { ...s.layers, [id]: !s.layers[id] } })),
  setPaused: (paused) => set({ paused }),
  setGesture: (gestureStatus, gestureMessage = '') => set({ gestureStatus, gestureMessage }),
  addRotation: (d) => set((s) => ({ rotationY: s.rotationY + d })),
  addZoom: (d) => set((s) => ({ zoomImpulse: s.zoomImpulse + d })),
  consumeZoom: () => { const z = get().zoomImpulse; if (z) set({ zoomImpulse: 0 }); return z },
  resetView: () => set((s) => ({ rotationY: 0, zoomImpulse: 0, resetTick: s.resetTick + 1 })),
}))
