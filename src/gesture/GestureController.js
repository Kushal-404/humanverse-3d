import { dispatch, CMD } from '../interaction/InteractionController'
import { useAnatomyStore } from '../store/useAnatomyStore'

// Tunable thresholds. Calibrate with real users, lighting and webcam placement.
const T = { pinch: 0.28, zoomDeadzone: 0.004, zoomGain: 3, rotateGain: 4, pauseHoldMs: 1200, pauseCooldownMs: 2000 }
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const palm = (h) => ({ x: (h[0].x + h[5].x + h[17].x) / 3, y: (h[0].y + h[5].y + h[17].y) / 3 })
const isPinch = (h) => dist(h[4], h[8]) / (dist(h[0], h[9]) || 1) < T.pinch
const extended = (h, tip, pip) => dist(h[tip], h[0]) > dist(h[pip], h[0]) * 1.1
const isOpenPalm = (h) => [[8, 6], [12, 10], [16, 14], [20, 18]].every(([t, p]) => extended(h, t, p)) && !isPinch(h)

export class GestureController {
  constructor() { this.prevDist = null; this.prevX = null; this.smooth = null; this.openSince = null; this.lastPause = 0 }

  // hands: array of 21-landmark arrays in [0,1]. The preview is mirrored, so x is flipped for rotation.
  update(hands, now = performance.now()) {
    const paused = useAnatomyStore.getState().paused

    // One open palm held ~1.2 s toggles pause (so the same pose can resume).
    if (hands.length === 1 && isOpenPalm(hands[0])) {
      this.openSince ??= now
      if (now - this.openSince > T.pauseHoldMs && now - this.lastPause > T.pauseCooldownMs) {
        dispatch(CMD.TOGGLE_PAUSE); this.lastPause = now; this.openSince = null
      }
    } else this.openSince = null

    if (paused) { this.prevDist = this.prevX = this.smooth = null; return }

    if (hands.length === 2) {
      this.prevX = null
      const d = dist(palm(hands[0]), palm(hands[1]))
      this.smooth = this.smooth == null ? d : this.smooth * 0.7 + d * 0.3
      if (this.prevDist != null) {
        const delta = this.smooth - this.prevDist
        if (Math.abs(delta) > T.zoomDeadzone) dispatch(delta > 0 ? CMD.ZOOM_IN : CMD.ZOOM_OUT, Math.abs(delta) * T.zoomGain)
      }
      this.prevDist = this.smooth
    } else if (hands.length === 1 && isPinch(hands[0])) {
      this.prevDist = this.smooth = null
      const x = (hands[0][4].x + hands[0][8].x) / 2
      if (this.prevX != null) dispatch(CMD.ROTATE, -(x - this.prevX) * T.rotateGain)
      this.prevX = x
    } else { this.prevDist = this.prevX = this.smooth = null }
  }
}
