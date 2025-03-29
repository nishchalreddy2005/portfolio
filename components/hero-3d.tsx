"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

function ParticleField({ count = 800 }) {
  const mesh = useRef()
  const light = useRef()

  // Create particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = Math.random() * 2 - 1
      const y = Math.random() * 2 - 1
      const z = Math.random() * 2 - 1

      temp.push({ time, factor, speed, x, y, z })
    }
    return temp
  }, [count])

  // Create particle positions and colors
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = particles[i].x * 10
      positions[i3 + 1] = particles[i].y * 10
      positions[i3 + 2] = particles[i].z * 10

      // Gradient colors from primary to secondary to accent
      const color = new THREE.Color()
      if (i < count / 3) {
        color.setRGB(0.39, 0.4, 0.94) // primary (indigo)
      } else if (i < (count / 3) * 2) {
        color.setRGB(0.06, 0.73, 0.51) // secondary (emerald)
      } else {
        color.setRGB(0.96, 0.25, 0.37) // accent (rose)
      }

      color.toArray(colors, i3)
    }

    return [positions, colors]
  }, [count, particles])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const { factor, speed, x, y, z } = particles[i]

      // Update positions in a wave-like pattern
      const positionArray = mesh.current.geometry.attributes.position.array
      positionArray[i3] = x + Math.sin((time + x * 2) / factor) * 2
      positionArray[i3 + 1] = y + Math.cos((time + y * 2) / factor) * 2
      positionArray[i3 + 2] = z + Math.sin((time + z * 2) / factor) * 2
    }

    mesh.current.geometry.attributes.position.needsUpdate = true

    // Rotate light for dynamic lighting effect
    if (light.current) {
      light.current.position.x = Math.sin(time * 0.2) * 20
      light.current.position.y = Math.cos(time * 0.2) * 20
    }
  })

  return (
    <>
      <pointLight ref={light} distance={60} intensity={2} color="#6366f1" />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
    </>
  )
}

function FloatingLogo() {
  const mesh = useRef()

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2
      mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={mesh} scale={2.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          roughness={0.3}
          metalness={0.8}
          emissive="#4f46e5"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  )
}

export default function Hero3D() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
      <ParticleField />
      <FloatingLogo />
      <Environment preset="city" />
    </Canvas>
  )
}

