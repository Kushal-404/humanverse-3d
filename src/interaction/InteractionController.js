import { useAnatomyStore } from '../store/useAnatomyStore'

// Every input (mouse, keyboard, gestures) calls dispatch() with the same commands.
export const CMD = {
  ZOOM_IN: 'ZOOM_IN', ZOOM_OUT: 'ZOOM_OUT', ROTATE: 'ROTATE',
  SELECT: 'SELECT', DESELECT: 'DESELECT', RESET_VIEW: 'RESET_VIEW',
  TOGGLE_PAUSE: 'TOGGLE_PAUSE', TOGGLE_LAYER: 'TOGGLE_LAYER',
}

export function dispatch(type, value) {
  const s = useAnatomyStore.getState()
  switch (type) {
    case CMD.ZOOM_IN: return s.addZoom(-(value ?? 0.1))
    case CMD.ZOOM_OUT: return s.addZoom(value ?? 0.1)
    case CMD.ROTATE: return s.addRotation(value ?? 0)
    case CMD.SELECT: return s.select(value)
    case CMD.DESELECT: return s.select(null)
    case CMD.RESET_VIEW: return s.resetView()
    case CMD.TOGGLE_PAUSE: return s.setPaused(!s.paused)
    case CMD.TOGGLE_LAYER: return s.toggleLayer(value)
  }
}

export function attachKeyboard() {
  const onKey = (e) => {
    const k = e.key.toLowerCase()
    if (k === 'arrowleft') dispatch(CMD.ROTATE, -0.12)
    else if (k === 'arrowright') dispatch(CMD.ROTATE, 0.12)
    else if (k === '+' || k === '=') dispatch(CMD.ZOOM_IN, 0.1)
    else if (k === '-') dispatch(CMD.ZOOM_OUT, 0.1)
    else if (k === 'r') dispatch(CMD.RESET_VIEW)
    else if (k === 'p') dispatch(CMD.TOGGLE_PAUSE)
    else if (k === 'escape') dispatch(CMD.DESELECT)
    else return
    e.preventDefault()
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}
