import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import sphereFragmentShader from './shaders/sphere/fragment.frag?raw'
import sphereVertexShader from './shaders/sphere/vertex.vert?raw'
import particlesFragmentShader from './shaders/particles/fragment.frag?raw'
import particlesVertexShader from './shaders/particles/vertex.vert?raw'

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const mouse = {
  x: 0,
  y: 0,
}

const canvas = document.getElementById('webGL')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const controls = new OrbitControls(camera, canvas)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
const clock = new THREE.Clock()

controls.enableDamping = true

camera.fov = 75
camera.aspect = size.width / size.height
camera.far = 100
camera.near = 0.1
camera.position.set(0, 0, 3.5)

scene.add(camera)

const sphereGeometry = new THREE.SphereBufferGeometry(1, 512, 512)
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: sphereVertexShader,
  fragmentShader: sphereFragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
})
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)

const Points = 3000
const positions = new Float32Array(Points * 3)
const incGoldenRatio = Math.PI * (3 - Math.sqrt(5))
const offset = 2 / Points
const rad = 1.7

for (let i = 0; i < Points; i++) {
  const index = i * 3
  const y = i * offset - 1 + offset / 2
  const r = Math.sqrt(1 - y ** 2)
  const phi = i * incGoldenRatio

  positions.set(
    [rad * Math.cos(phi) * r, rad * y, rad * Math.sin(phi) * r],
    index
  )
}

const pointGeometry = new THREE.BufferGeometry()
const pointMaterial = new THREE.ShaderMaterial({
  fragmentShader: particlesFragmentShader,
  vertexShader: particlesVertexShader,
  uniforms: {
    uTime: { value: 0 },
  },
  depthTest: true,
  depthWrite: true,
  transparent: true,
})
console.log(positions)
pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const pointMesh = new THREE.Points(pointGeometry, pointMaterial)
scene.add(pointMesh)

function resizeHandler() {
  size.height = window.innerHeight
  size.width = window.innerWidth

  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
resizeHandler()

window.addEventListener('resize', resizeHandler)

function tick() {
  const elapsedTime = clock.getElapsedTime()

  sphereMaterial.uniforms.uTime.value = elapsedTime
  pointMaterial.uniforms.uTime.value = elapsedTime
  pointMesh.rotation.y = elapsedTime / 10

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
const event = isTouch ? 'touchmove' : 'mousemove'
let timeoutId
window.addEventListener(event, e => {
  if (isTouch && e.touches?.[0]) {
    const touchEvent = e.touches[0]
    mouse.x = (touchEvent.clientX / size.width) * 2 - 1
    mouse.y = (-touchEvent.clientY / size.height) * 2 + 1
  } else {
    mouse.x = (e.clientX / size.width) * 2 - 1
    mouse.y = (-e.clientY / size.height) * 2 + 1
  }

  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    mouse.x = 0
    mouse.y = 0
  }, 1000)
})
