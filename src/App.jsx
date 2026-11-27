import { useEffect } from 'react'
import AnatomyScene from './anatomy/AnatomyScene'
import Sidebar from './components/Sidebar'
import InfoPanel from './components/InfoPanel'
import { attachKeyboard } from './interaction/InteractionController'
import { useAnatomyStore } from './store/useAnatomyStore'

export default function App() {
  useEffect(attachKeyboard, [])
  const paused = useAnatomyStore((s) => s.paused)
  return (
    <div className="app">
      <Sidebar />
      <main className="stage">
        <AnatomyScene />
        {paused && <div className="badge">Gestures paused</div>}
      </main>
      <InfoPanel />
    </div>
  )
}
