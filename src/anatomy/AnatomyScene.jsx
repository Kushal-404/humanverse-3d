import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import HumanModel from './HumanModel'
import { useAnatomyStore } from '../store/useAnatomyStore'
import { dispatch, CMD } from '../interaction/InteractionController'

const USE_GLB = false // set true after adding public/models/human.glb
const HOME = [0, 0.6, 5.2]

// Applies store-driven rotation and zoom (from gestures/keyboard) to the scene.
function Rig({ children }) {
  const group = useRef()
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const resetTick = useAnatomyStore((s) => s.resetTick)

  useFrame(() => {
    const st = useAnatomyStore.getState()
    group.current.rotation.y += (st.rotationY - group.current.rotation.y) * 0.2
    const z = st.consumeZoom()
    if (z) {
      const len = camera.position.length() * (1 + z)
      camera.position.setLength(Math.min(10, Math.max(1.5, len)))
    }
  })
  useEffect(() => {
    if (!controls) return
    camera.position.set(...HOME)
    controls.target.set(0, 0.3, 0)
    controls.update()
    group.current.rotation.y = 0
  }, [resetTick, controls, camera])
  return <group ref={group}>{children}</group>
}

export default function AnatomyScene() {
  return (
    <Canvas camera={{ position: HOME, fov: 40 }} onPointerMissed={() => dispatch(CMD.DESELECT)}>
      <color attach="background" args={['#10161b']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />
      <Rig><HumanModel useGlb={USE_GLB} /></Rig>
      <ContactShadows position={[0, -1.95, 0]} opacity={0.4} scale={6} blur={2.5} />
      <OrbitControls makeDefault enablePan={false} minDistance={1.5} maxDistance={10} />
    </Canvas>
  )
}
