import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { GestureController } from './GestureController'
import { useAnatomyStore } from '../store/useAnatomyStore'

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

// Starts webcam + hand tracking. Frames are processed locally; nothing is uploaded.
// Returns a stop() function.
export async function startHandTracking(video) {
  const { setGesture } = useAnatomyStore.getState()
  setGesture('loading', 'Starting camera…')
  let stream, landmarker, raf, stopped = false
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
    video.srcObject = stream
    await video.play()
    landmarker = await HandLandmarker.createFromOptions(await FilesetResolver.forVisionTasks(WASM), {
      baseOptions: { modelAssetPath: MODEL }, runningMode: 'VIDEO', numHands: 2,
    })
  } catch (err) {
    stream?.getTracks().forEach((t) => t.stop())
    setGesture('error', err.name === 'NotAllowedError'
      ? 'Camera permission was denied. Allow camera access in your browser, or use mouse and keyboard.'
      : 'Could not start hand tracking. Use mouse and keyboard instead.')
    return () => {}
  }
  setGesture('ready', 'Tracking hands')
  const controller = new GestureController()
  let last = -1
  const loop = () => {
    if (stopped) return
    if (video.currentTime !== last) {
      last = video.currentTime
      controller.update(landmarker.detectForVideo(video, performance.now()).landmarks || [])
    }
    raf = requestAnimationFrame(loop)
  }
  loop()
  return () => {
    stopped = true; cancelAnimationFrame(raf)
    stream.getTracks().forEach((t) => t.stop()); landmarker.close()
    video.srcObject = null; setGesture('off')
  }
}
