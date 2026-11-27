import { useAnatomyStore } from '../store/useAnatomyStore'
import { anatomyData } from '../data/anatomyData'
import { dispatch, CMD } from '../interaction/InteractionController'

export default function InfoPanel() {
  const id = useAnatomyStore((s) => s.selectedId)
  const a = id && anatomyData[id]
  if (!a) return (
    <aside className="info empty"><p>Select a structure in the model to see what it is and what it does.</p></aside>
  )
  return (
    <aside className="info">
      <p className="cat">{a.category}</p>
      <h2>{a.name}</h2>
      <p>{a.description}</p>
      <h3>Location</h3><p>{a.location}</p>
      <h3>Functions</h3>
      <ul>{a.functions.map((f) => <li key={f}>{f}</li>)}</ul>
      <button onClick={() => dispatch(CMD.DESELECT)}>Clear selection</button>
    </aside>
  )
}
