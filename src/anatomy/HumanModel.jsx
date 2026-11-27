import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useAnatomyStore } from '../store/useAnatomyStore'
import { anatomyData, meshToId } from '../data/anatomyData'
import { dispatch, CMD } from '../interaction/InteractionController'

// Placeholder body built from primitives so the full pipeline works before a real model exists.
// Mesh names match anatomyData ids. Skin is translucent so inner layers stay visible.
const P = (id, geo, args, pos, color, scale = [1, 1, 1], extra = {}) => ({ id, geo, args, pos, color, scale, ...extra })
const PARTS = [
  P('skin', 'capsule', [0.34, 1.0, 8, 24], [0, 0.35, 0], '#d9a98c', [1, 1, 0.7]),
  P('skin', 'sphere', [0.27, 24, 24], [0, 1.25, 0], '#d9a98c'),
  P('skin', 'capsule', [0.09, 1.0, 8, 16], [0.55, 0.25, 0], '#d9a98c'),
  P('skin', 'capsule', [0.09, 1.0, 8, 16], [-0.55, 0.25, 0], '#d9a98c'),
  P('skin', 'capsule', [0.14, 1.2, 8, 16], [0.18, -1.2, 0], '#d9a98c'),
  P('skin', 'capsule', [0.14, 1.2, 8, 16], [-0.18, -1.2, 0], '#d9a98c'),
  P('skull', 'sphere', [0.2, 24, 24], [0, 1.27, 0], '#e9e2d0'),
  P('brain', 'sphere', [0.15, 24, 24], [0, 1.3, 0.02], '#d98a9a', [1, 0.9, 1]),
  P('spine', 'cylinder', [0.035, 0.035, 1.5, 12], [0, 0.45, -0.1], '#e9e2d0'),
  P('ribcage', 'cylinder', [0.25, 0.22, 0.55, 20, 1, true], [0, 0.6, 0], '#e9e2d0', [1, 1, 0.7]),
  P('left_lung', 'sphere', [0.15, 20, 20], [0.15, 0.6, 0], '#b8696f', [0.8, 1.7, 0.8]),
  P('right_lung', 'sphere', [0.15, 20, 20], [-0.15, 0.6, 0], '#b8696f', [0.8, 1.7, 0.8]),
  P('heart', 'sphere', [0.095, 20, 20], [0.07, 0.52, 0.06], '#a8322f'),
]

const HIGHLIGHT = '#4fb5a5'

function pick(e) {
  // Prefer inner structures over the translucent skin when both are hit.
  const hits = e.intersections.map((h) => meshToId[h.object.name]).filter(Boolean)
  return hits.find((id) => id !== 'skin') ?? hits[0] ?? null
}

function Placeholder() {
  const layers = useAnatomyStore((s) => s.layers)
  const selectedId = useAnatomyStore((s) => s.selectedId)
  const [hover, setHover] = useState(null)
  return (
    <group>
      {PARTS.map((p, i) => {
        const Geo = { capsule: 'capsuleGeometry', sphere: 'sphereGeometry', cylinder: 'cylinderGeometry' }[p.geo]
        const on = selectedId === p.id || hover === p.id
        const isSkin = p.id === 'skin'
        return (
          <mesh key={i} name={p.id} position={p.pos} scale={p.scale}
            visible={layers[anatomyData[p.id].layer]}
            onClick={(e) => { e.stopPropagation(); dispatch(CMD.SELECT, pick(e)) }}
            onPointerOver={(e) => { e.stopPropagation(); setHover(pick(e)); document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { setHover(null); document.body.style.cursor = '' }}>
            <Geo args={p.args} />
            <meshStandardMaterial color={p.color} roughness={0.6}
              transparent={isSkin} opacity={isSkin ? 0.22 : 1} depthWrite={!isSkin}
              side={p.args.length > 5 && p.geo === 'cylinder' ? 2 : 0}
              emissive={on ? HIGHLIGHT : '#000'} emissiveIntensity={on ? 0.7 : 0} />
          </mesh>
        )
      })}
    </group>
  )
}

// Real model: put your exported file at public/models/human.glb and set USE_GLB = true in AnatomyScene.jsx.
// Object names in the GLB must match `modelMesh` values in src/data/anatomyData.js.
function GLBModel() {
  const { scene } = useGLTF('/models/human.glb')
  const layers = useAnatomyStore((s) => s.layers)
  const selectedId = useAnatomyStore((s) => s.selectedId)
  useEffect(() => {
    scene.traverse((o) => {
      if (!o.isMesh) return
      const id = meshToId[o.name]
      if (!id) return
      o.visible = layers[anatomyData[id].layer]
      if (o.material?.emissive) {
        o.material.emissive.set(id === selectedId ? HIGHLIGHT : '#000')
        o.material.emissiveIntensity = id === selectedId ? 0.7 : 0
      }
    })
  }, [scene, layers, selectedId])
  return <primitive object={scene} onClick={(e) => { e.stopPropagation(); dispatch(CMD.SELECT, pick(e)) }} />
}

export default function HumanModel({ useGlb }) {
  return useGlb ? <GLBModel /> : <Placeholder />
}
