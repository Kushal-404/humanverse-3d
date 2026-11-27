import { useEffect, useRef } from 'react'
import { useAnatomyStore } from '../store/useAnatomyStore'
import { LAYERS } from '../data/anatomyData'
import { dispatch, CMD } from '../interaction/InteractionController'
import { startHandTracking } from '../gesture/HandTracker'

export default function Sidebar() {
  const layers = useAnatomyStore((s) => s.layers)
  const status = useAnatomyStore((s) => s.gestureStatus)
  const message = useAnatomyStore((s) => s.gestureMessage)
  const paused = useAnatomyStore((s) => s.paused)
  const video = useRef(null)
  const stop = useRef(null)
  const on = status === 'ready' || status === 'loading'

  useEffect(() => () => stop.current?.(), [])
  const toggleCamera = async () => {
    if (on) { stop.current?.(); stop.current = null; return }
    stop.current = await startHandTracking(video.current)
  }

  return (
    <aside className="sidebar">
      <h1>HumanVerse 3D</h1>
      <section>
        <h2>Layers</h2>
        {LAYERS.map((l) => (
          <label key={l.id} className="row">
            <input type="checkbox" checked={layers[l.id]} onChange={() => dispatch(CMD.TOGGLE_LAYER, l.id)} />
            {l.label}
          </label>
        ))}
      </section>
      <section>
        <h2>View</h2>
        <div className="btns">
          <button onClick={() => dispatch(CMD.ZOOM_IN, 0.2)}>Zoom in</button>
          <button onClick={() => dispatch(CMD.ZOOM_OUT, 0.2)}>Zoom out</button>
          <button onClick={() => dispatch(CMD.RESET_VIEW)}>Reset view</button>
        </div>
        <p className="hint">Drag to orbit, scroll to zoom. Keys: ← → rotate, + − zoom, R reset, P pause, Esc deselect.</p>
      </section>
      <section>
        <h2>Hand gestures</h2>
        <button className={on ? 'on' : ''} onClick={toggleCamera}>{on ? 'Turn camera off' : 'Turn camera on'}</button>
        <div className="cam" hidden={!on}>
          <video ref={video} muted playsInline />
          <span className="dot" aria-label="Camera is on" />
        </div>
        {message && <p className={status === 'error' ? 'hint err' : 'hint'}>{message}</p>}
        {status === 'ready' && (
          <>
            <button onClick={() => dispatch(CMD.TOGGLE_PAUSE)}>{paused ? 'Resume gestures' : 'Pause gestures'}</button>
            <ul className="hint">
              <li>Both hands apart or together: zoom</li>
              <li>Pinch and move sideways: rotate</li>
              <li>Hold one open palm: pause or resume</li>
            </ul>
          </>
        )}
        <p className="hint">Video stays in your browser and is never uploaded.</p>
      </section>
    </aside>
  )
}
