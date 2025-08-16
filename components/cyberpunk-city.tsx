"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function CyberpunkCity() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const animationIdRef = useRef<number>()
  const [isLoaded, setIsLoaded] = useState(false)

  const mouseRef = useRef({ x: 0, y: 0 })
  const targetCameraPosition = useRef({ x: 0, y: 15, z: 30 })
  const buildingsRef = useRef<THREE.Mesh[]>([])
  const raycasterRef = useRef<THREE.Raycaster>()
  const hoveredBuildingRef = useRef<THREE.Mesh | null>(null)
  const hologramRef = useRef<THREE.Group>()
  const hologramTextRef = useRef<THREE.Mesh[]>([])
  const scrollProgressRef = useRef(0)
  const isScrollingRef = useRef(false)
  const [currentDistrict, setCurrentDistrict] = useState("Central Plaza")

  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const audioContextRef = useRef<AudioContext>()
  const backgroundMusicRef = useRef<HTMLAudioElement>()
  const ambientSoundsRef = useRef<HTMLAudioElement[]>([])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 50, 200)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 15, 30)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const raycaster = new THREE.Raycaster()
    raycasterRef.current = raycaster

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Create cyberpunk city
    const buildings = createCyberpunkCity(scene)
    buildingsRef.current = buildings

    const hologram = createHolographicCenterpiece(scene)
    hologramRef.current = hologram

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Neon lighting with enhanced effects
    const neonLight1 = new THREE.PointLight(0xff00ff, 3, 120)
    neonLight1.position.set(-20, 10, 0)
    scene.add(neonLight1)

    const neonLight2 = new THREE.PointLight(0x00ffff, 3, 120)
    neonLight2.position.set(20, 10, 0)
    scene.add(neonLight2)

    const rimLight = new THREE.DirectionalLight(0x00ffff, 0.3)
    rimLight.position.set(-50, 20, -50)
    scene.add(rimLight)

    const cameraWaypoints = [
      // Central Plaza - Starting position
      {
        position: { x: 0, y: 15, z: 30 },
        lookAt: { x: 0, y: 0, z: 0 },
        district: "Central Plaza",
      },
      // Neon District - Close to buildings
      {
        position: { x: -25, y: 8, z: 10 },
        lookAt: { x: -15, y: 5, z: -10 },
        district: "Neon District",
      },
      // Corporate Sector - High angle view
      {
        position: { x: 15, y: 25, z: -20 },
        lookAt: { x: 0, y: 10, z: -30 },
        district: "Corporate Sector",
      },
      // Underground Level - Street level
      {
        position: { x: 0, y: 3, z: -45 },
        lookAt: { x: 0, y: 8, z: -50 },
        district: "Underground",
      },
      // Skyline View - Aerial perspective
      {
        position: { x: 40, y: 35, z: 20 },
        lookAt: { x: 0, y: 0, z: 0 },
        district: "Skyline",
      },
    ]

    const initializeAudio = async () => {
      if (audioInitialized) return

      try {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

        // Create background music (synthwave-style using Web Audio API)
        const backgroundMusic = new Audio()
        backgroundMusic.loop = true
        backgroundMusic.volume = 0.3
        backgroundMusicRef.current = backgroundMusic

        // Create ambient sounds
        const cityHum = new Audio()
        cityHum.loop = true
        cityHum.volume = 0.2

        const rainSound = new Audio()
        rainSound.loop = true
        rainSound.volume = 0.15

        ambientSoundsRef.current = [cityHum, rainSound]

        setAudioInitialized(true)
        console.log("[v0] Audio system initialized")
      } catch (error) {
        console.log("[v0] Audio initialization failed:", error)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Only apply mouse parallax when not actively scrolling
      if (isScrollingRef.current) return

      // Normalize mouse coordinates to -1 to 1
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Apply subtle parallax offset to current camera position
      const currentWaypoint = getCurrentWaypoint(scrollProgressRef.current, cameraWaypoints)
      targetCameraPosition.current.x = currentWaypoint.position.x + mouseRef.current.x * 2
      targetCameraPosition.current.y = currentWaypoint.position.y + mouseRef.current.y * 1
      targetCameraPosition.current.z = currentWaypoint.position.z - mouseRef.current.y * 1

      // Raycasting for hover effects
      raycaster.setFromCamera(mouseRef.current, camera)
      const intersects = raycaster.intersectObjects(buildings)

      // Reset previous hovered building
      if (hoveredBuildingRef.current) {
        const material = hoveredBuildingRef.current.material as THREE.MeshPhongMaterial
        material.emissiveIntensity = 0.1
        hoveredBuildingRef.current = null
      }

      // Highlight new hovered building
      if (intersects.length > 0) {
        const building = intersects[0].object as THREE.Mesh
        const material = building.material as THREE.MeshPhongMaterial
        material.emissiveIntensity = 0.3
        hoveredBuildingRef.current = building
        document.body.style.cursor = "pointer"
      } else {
        document.body.style.cursor = "default"
      }
    }

    const handleScroll = (event: WheelEvent) => {
      event.preventDefault()

      isScrollingRef.current = true

      // Update scroll progress (0 to 1)
      const scrollSensitivity = 0.001
      scrollProgressRef.current += event.deltaY * scrollSensitivity
      scrollProgressRef.current = Math.max(0, Math.min(1, scrollProgressRef.current))

      // Get current waypoint and update camera
      const currentWaypoint = getCurrentWaypoint(scrollProgressRef.current, cameraWaypoints)
      targetCameraPosition.current = { ...currentWaypoint.position }

      // Update district display
      setCurrentDistrict(currentWaypoint.district)

      // Reset scrolling flag after a delay
      setTimeout(() => {
        isScrollingRef.current = false
      }, 100)
    }

    const handleClick = (event: MouseEvent) => {
      // Initialize audio on first user interaction
      if (!audioInitialized) {
        initializeAudio()
      }

      // Normalize mouse coordinates
      const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(buildings)

      if (intersects.length > 0) {
        const building = intersects[0].object as THREE.Mesh

        const originalScale = building.scale.clone()
        const targetScale = originalScale.clone().multiplyScalar(1.2)

        // Play interaction sound
        if (audioEnabled && audioContextRef.current) {
          playInteractionSound()
        }

        // Animate scale up and down
        const animateBuilding = (progress: number) => {
          if (progress < 0.5) {
            // Scale up
            const t = progress * 2
            building.scale.lerpVectors(originalScale, targetScale, t)
          } else {
            // Scale down
            const t = (progress - 0.5) * 2
            building.scale.lerpVectors(targetScale, originalScale, t)
          }

          if (progress < 1) {
            requestAnimationFrame(() => animateBuilding(progress + 0.05))
          }
        }

        animateBuilding(0)

        // Enhanced flash effect
        const material = building.material as THREE.MeshPhongMaterial
        const originalIntensity = material.emissiveIntensity
        material.emissiveIntensity = 1.2
        setTimeout(() => {
          material.emissiveIntensity = originalIntensity
        }, 200)
      }
    }

    const playInteractionSound = () => {
      if (!audioContextRef.current) return

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + 0.1)
    }

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)
    window.addEventListener("wheel", handleScroll, { passive: false })

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const currentWaypoint = getCurrentWaypoint(scrollProgressRef.current, cameraWaypoints)

      camera.position.lerp(
        new THREE.Vector3(
          targetCameraPosition.current.x,
          targetCameraPosition.current.y,
          targetCameraPosition.current.z,
        ),
        0.05,
      )

      // Smooth look-at transition
      const currentLookAt = new THREE.Vector3(
        currentWaypoint.lookAt.x,
        currentWaypoint.lookAt.y,
        currentWaypoint.lookAt.z,
      )

      // Create a smooth look-at transition
      const currentTarget = new THREE.Vector3()
      camera.getWorldDirection(currentTarget)
      currentTarget.multiplyScalar(-1).add(camera.position)
      currentTarget.lerp(currentLookAt, 0.02)
      camera.lookAt(currentTarget)

      const time = Date.now() * 0.001
      neonLight1.intensity = 2 + Math.sin(time * 3) * 0.8
      neonLight2.intensity = 2 + Math.cos(time * 2.5) * 0.8

      // Animate light colors
      neonLight1.color.setHSL((time * 0.1) % 1, 1, 0.5)
      neonLight2.color.setHSL((time * 0.15 + 0.5) % 1, 1, 0.5)

      const fogIntensity = 50 + scrollProgressRef.current * 100
      const fogColor = currentDistrict === "Underground" ? 0x001122 : 0x000000
      scene.fog = new THREE.Fog(fogColor, fogIntensity * 0.5, fogIntensity * 2)

      if (hologramRef.current) {
        // Rotation animation
        hologramRef.current.rotation.y = time * 0.5
        hologramRef.current.rotation.x = Math.sin(time * 0.3) * 0.1

        // Floating animation
        hologramRef.current.position.y = 12 + Math.sin(time * 2) * 2

        // Scale pulsing
        const scale = 1 + Math.sin(time * 3) * 0.1
        hologramRef.current.scale.setScalar(scale)

        // Animate individual text elements
        const textMeshes = hologramRef.current.userData.textMeshes as THREE.Mesh[]
        textMeshes.forEach((textMesh, index) => {
          const material = textMesh.material as THREE.MeshPhongMaterial

          // Color shifting
          const hue = (time * 0.5 + index * 0.2) % 1
          material.emissive.setHSL(hue, 1, 0.3)

          // Individual rotation
          textMesh.rotation.z = Math.sin(time * 2 + index) * 0.1

          // Emissive intensity pulsing
          material.emissiveIntensity = 0.5 + Math.sin(time * 4 + index) * 0.3
        })
      }

      const particles = scene.getObjectByName("particles") as THREE.Points
      if (particles) {
        particles.rotation.y += 0.001
        const particleMaterial = particles.material as THREE.PointsMaterial
        particleMaterial.color.setHSL((time * 0.1) % 1, 0.8, 0.6)
      }

      renderer.render(scene, camera)
    }

    animate()
    setIsLoaded(true)

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("wheel", handleScroll)
      document.body.style.cursor = "default"

      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }
      ambientSoundsRef.current.forEach((sound) => sound.pause())

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  const toggleAudio = () => {
    if (!audioInitialized) return

    setAudioEnabled(!audioEnabled)

    if (!audioEnabled) {
      // Start audio
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.play().catch(console.log)
      }
      ambientSoundsRef.current.forEach((sound) => {
        sound.play().catch(console.log)
      })
    } else {
      // Stop audio
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }
      ambientSoundsRef.current.forEach((sound) => sound.pause())
    }
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full" />

      {/* Enhanced loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="text-cyan-400 text-2xl font-mono animate-pulse mb-4">INITIALIZING CYBERPUNK CITY...</div>
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 animate-pulse"></div>
            </div>
            <div className="text-pink-400 font-mono text-sm mt-4 opacity-60">NEURAL INTERFACE LOADING...</div>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text neon-glow animate-pulse">
          CYBERPUNK CITY
        </h1>
        <p className="text-cyan-300 font-mono mt-2 text-lg">Welcome to the future</p>
        <div className="w-32 h-0.5 bg-gradient-to-r from-pink-500 to-cyan-400 mt-2 animate-pulse"></div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 text-right">
        <div className="text-pink-400 font-mono text-sm backdrop-blur-sm bg-black/20 p-3 rounded border border-pink-500/30">
          <div className="mb-1">MOUSE: Camera parallax</div>
          <div className="mb-1">HOVER: Highlight buildings</div>
          <div className="mb-1">CLICK: Activate building</div>
          <div>SCROLL: Navigate districts</div>
        </div>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <div className="text-cyan-400 font-mono text-xs opacity-60 backdrop-blur-sm bg-black/20 p-2 rounded">
          NEURAL INTERFACE: ACTIVE
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-10">
        <div className="text-pink-500 font-mono text-xs opacity-80 backdrop-blur-sm bg-black/20 p-2 rounded">
          <div className="animate-pulse">◉ HOLOGRAM PROJECTION: ONLINE</div>
        </div>
      </div>

      {/* Enhanced district display */}
      <div className="absolute top-1/2 left-8 z-10 transform -translate-y-1/2">
        <div className="text-cyan-300 font-mono text-lg backdrop-blur-sm bg-black/30 p-4 rounded border border-cyan-500/30">
          <div className="text-xs opacity-60 mb-1">CURRENT LOCATION</div>
          <div className="text-2xl font-bold neon-glow animate-pulse">{currentDistrict}</div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-pink-500 to-cyan-400 mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Enhanced progress bar */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="w-2 h-40 bg-gray-800 rounded-full overflow-hidden border border-cyan-500/30">
          <div
            className="w-full bg-gradient-to-t from-pink-500 via-purple-500 to-cyan-400 transition-all duration-300 ease-out animate-pulse"
            style={{ height: `${scrollProgressRef.current * 100}%` }}
          ></div>
        </div>
        <div className="text-cyan-400 font-mono text-xs mt-2 text-center">DEPTH</div>
      </div>

      {/* Audio control */}
      <div className="absolute top-20 right-8 z-10">
        <button
          onClick={toggleAudio}
          className="text-cyan-400 font-mono text-xs backdrop-blur-sm bg-black/20 p-2 rounded border border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
          disabled={!audioInitialized}
        >
          {audioEnabled ? "🔊 AUDIO: ON" : "🔇 AUDIO: OFF"}
        </button>
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="w-full h-full opacity-5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
    </div>
  )
}

function createCyberpunkCity(scene: THREE.Scene) {
  const buildings: THREE.Mesh[] = []

  // Create multiple buildings with different heights and neon colors
  for (let i = 0; i < 20; i++) {
    const height = Math.random() * 30 + 10
    const width = Math.random() * 4 + 2
    const depth = Math.random() * 4 + 2

    const geometry = new THREE.BoxGeometry(width, height, depth)

    // Create neon-lit building material
    const neonColors = [0xff00ff, 0x00ffff, 0xff0080, 0x0080ff, 0x80ff00]
    const color = neonColors[Math.floor(Math.random() * neonColors.length)]

    const material = new THREE.MeshPhongMaterial({
      color: 0x222222,
      emissive: color,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.8,
    })

    const building = new THREE.Mesh(geometry, material)

    // Position buildings in a grid with some randomness
    const x = ((i % 5) - 2) * 15 + (Math.random() - 0.5) * 5
    const z = Math.floor(i / 5) * 15 - 30 + (Math.random() - 0.5) * 5

    building.position.set(x, height / 2, z)
    building.castShadow = true
    building.receiveShadow = true

    // Add neon edge lighting
    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
    })
    const wireframe = new THREE.LineSegments(edges, lineMaterial)
    building.add(wireframe)

    scene.add(building)
    buildings.push(building)
  }

  // Create ground with reflective surface
  const groundGeometry = new THREE.PlaneGeometry(200, 200)
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.8,
    reflectivity: 0.5,
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Add floating particles for atmosphere
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200 // x
    positions[i + 1] = Math.random() * 50 // y
    positions[i + 2] = (Math.random() - 0.5) * 200 // z
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.5,
    transparent: true,
    opacity: 0.6,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  particles.name = "particles"
  scene.add(particles)

  return buildings
}

function createHolographicCenterpiece(scene: THREE.Scene): THREE.Group {
  const hologramGroup = new THREE.Group()
  const textMeshes: THREE.Mesh[] = []

  // Create 3D text geometry for "CYBER" and "PUNK"
  const textGeometry1 = new THREE.BoxGeometry(8, 2, 0.5)
  const textGeometry2 = new THREE.BoxGeometry(8, 2, 0.5)

  // Create holographic materials with different colors
  const material1 = new THREE.MeshPhongMaterial({
    color: 0x222222,
    emissive: 0xff00ff,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8,
    wireframe: false,
  })

  const material2 = new THREE.MeshPhongMaterial({
    color: 0x222222,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8,
    wireframe: false,
  })

  // Create text meshes
  const textMesh1 = new THREE.Mesh(textGeometry1, material1)
  const textMesh2 = new THREE.Mesh(textGeometry2, material2)

  // Position text elements
  textMesh1.position.set(0, 1, 0)
  textMesh2.position.set(0, -1, 0)

  // Add wireframe edges for holographic effect
  const edges1 = new THREE.EdgesGeometry(textGeometry1)
  const edges2 = new THREE.EdgesGeometry(textGeometry2)

  const edgeMaterial1 = new THREE.LineBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 1,
  })
  const edgeMaterial2 = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 1,
  })

  const wireframe1 = new THREE.LineSegments(edges1, edgeMaterial1)
  const wireframe2 = new THREE.LineSegments(edges2, edgeMaterial2)

  textMesh1.add(wireframe1)
  textMesh2.add(wireframe2)

  hologramGroup.add(textMesh1)
  hologramGroup.add(textMesh2)
  textMeshes.push(textMesh1, textMesh2)

  // Create holographic ring around the text
  const ringGeometry = new THREE.RingGeometry(6, 7, 32)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2
  hologramGroup.add(ring)

  // Create floating particles around hologram
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 200
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 10 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    positions[i] = radius * Math.sin(phi) * Math.cos(theta) // x
    positions[i + 1] = radius * Math.cos(phi) // y
    positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta) // z
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 0.3,
    transparent: true,
    opacity: 0.8,
  })

  const hologramParticles = new THREE.Points(particleGeometry, particleMaterial)
  hologramGroup.add(hologramParticles)

  // Create energy beams
  for (let i = 0; i < 4; i++) {
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xff00ff : 0x00ffff,
      transparent: true,
      opacity: 0.4,
    })
    const beam = new THREE.Mesh(beamGeometry, beamMaterial)

    const angle = (i / 4) * Math.PI * 2
    beam.position.set(Math.cos(angle) * 8, 0, Math.sin(angle) * 8)
    beam.rotation.z = Math.PI / 2
    beam.rotation.y = angle

    hologramGroup.add(beam)
  }

  // Position the entire hologram group
  hologramGroup.position.set(0, 12, 0)

  scene.add(hologramGroup)

  // Store text meshes reference for animation
  hologramGroup.userData = { textMeshes }

  return hologramGroup
}

function getCurrentWaypoint(progress: number, waypoints: any[]) {
  const totalWaypoints = waypoints.length - 1
  const scaledProgress = progress * totalWaypoints
  const currentIndex = Math.floor(scaledProgress)
  const nextIndex = Math.min(currentIndex + 1, totalWaypoints)
  const localProgress = scaledProgress - currentIndex

  const current = waypoints[currentIndex]
  const next = waypoints[nextIndex]

  // Smooth interpolation between waypoints
  const smoothProgress = localProgress * localProgress * (3 - 2 * localProgress) // Smoothstep

  return {
    position: {
      x: current.position.x + (next.position.x - current.position.x) * smoothProgress,
      y: current.position.y + (next.position.y - current.position.y) * smoothProgress,
      z: current.position.z + (next.position.z - current.position.z) * smoothProgress,
    },
    lookAt: {
      x: current.lookAt.x + (next.lookAt.x - current.lookAt.x) * smoothProgress,
      y: current.lookAt.y + (next.lookAt.y - current.lookAt.y) * smoothProgress,
      z: current.lookAt.z + (next.lookAt.z - current.lookAt.z) * smoothProgress,
    },
    district: localProgress < 0.5 ? current.district : next.district,
  }
}
