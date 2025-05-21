"use client"

import { useRef, useMemo, Suspense, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, PerspectiveCamera, OrbitControls, Html, Billboard, PointMaterial, Points } from "@react-three/drei"
import * as THREE from "three"
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

// Default category colors with more vibrant options
const DEFAULT_CATEGORY_COLORS = {
  Languages: "#00aaff", // Bright blue
  Frameworks: "#aa00ff", // Bright purple
  Databases: "#00ff88", // Bright green
  Web: "#ff3366", // Bright red
  Advanced: "#ff9500", // Bright orange
  Data: "#00ddff", // Bright cyan
}

// Particle system for background
function ParticleField({ count = 5000, color = "#ffffff" }) {
  const ref = useRef()

  // Generate random positions for particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [count])

  // Animate particles
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1
      ref.current.rotation.y = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <group ref={ref}>
      <Points limit={count}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
        <PointMaterial
          size={0.15}
          threshold={0.1}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

// Floating component for smooth animation
function Float({ children, speed = 1, intensity = 1, rotationIntensity = 1 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed
      ref.current.position.y = Math.sin(t) * 0.1 * intensity
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.01 * rotationIntensity
      ref.current.rotation.y = Math.sin(t * 0.1) * 0.01 * rotationIntensity
    }
  })

  return <group ref={ref}>{children}</group>
}

// Enhanced 3D Technical Skills Environment
function TechEnvironment3D() {
  const mainGridRef = useRef()
  const topGridRef = useRef()
  const bottomGridRef = useRef()
  const centralCoreRef = useRef()
  const orbitalRingRef = useRef()
  const dataFlowRefs = useRef([])
  const nodePlatformRefs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Animate main grid
    if (mainGridRef.current) {
      mainGridRef.current.rotation.z = Math.sin(t * 0.1) * 0.02
      mainGridRef.current.material.opacity = 0.2 + Math.sin(t * 0.5) * 0.05
    }

    // Animate top grid
    if (topGridRef.current) {
      topGridRef.current.position.y = 15 + Math.sin(t * 0.2) * 2
      topGridRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.1) * 0.05
      topGridRef.current.material.opacity = 0.1 + Math.sin(t * 0.3) * 0.05
    }

    // Animate bottom grid
    if (bottomGridRef.current) {
      bottomGridRef.current.position.y = -15 - Math.sin(t * 0.2) * 2
      bottomGridRef.current.rotation.x = Math.PI / 2 - Math.sin(t * 0.1) * 0.05
      bottomGridRef.current.material.opacity = 0.1 + Math.cos(t * 0.3) * 0.05
    }

    // Animate central core
    if (centralCoreRef.current) {
      centralCoreRef.current.rotation.y = t * 0.1
      centralCoreRef.current.rotation.z = Math.sin(t * 0.2) * 0.2
      centralCoreRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.1)
    }

    // Animate orbital ring
    if (orbitalRingRef.current) {
      orbitalRingRef.current.rotation.x = t * 0.2
      orbitalRingRef.current.rotation.z = t * 0.1
    }

    // Animate data flow tubes
    dataFlowRefs.current.forEach((flow, i) => {
      if (flow) {
        const offset = i * 0.5
        flow.material.opacity = 0.5 + Math.sin(t * 0.5 + offset) * 0.2
        flow.material.emissiveIntensity = 0.5 + Math.sin(t * 0.7 + offset) * 0.3
      }
    })

    // Animate node platforms
    nodePlatformRefs.current.forEach((platform, i) => {
      if (platform) {
        const offset = i * 0.7
        platform.position.y = Math.sin(t * 0.2 + offset) * 1.5
        platform.rotation.y = t * 0.1
        platform.rotation.z = Math.sin(t * 0.15 + offset) * 0.05
      }
    })
  })

  return (
    <group>
      {/* Main grid - made more dynamic */}
      <gridHelper ref={mainGridRef} args={[100, 80, "#00ffaa", "#00ffaa"]} position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.2} />
      </gridHelper>

      {/* Top grid - more 3D orientation */}
      <gridHelper
        ref={topGridRef}
        args={[100, 40, "#00ffaa", "#00ffaa"]}
        position={[0, 15, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.1} />
      </gridHelper>

      {/* Bottom grid - more 3D orientation */}
      <gridHelper
        ref={bottomGridRef}
        args={[100, 40, "#00ffaa", "#00ffaa"]}
        position={[0, -15, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.1} />
      </gridHelper>

      {/* Central core structure - brain-like tech hub */}
      <group ref={centralCoreRef} position={[0, 0, 0]}>
        {/* Main core sphere */}
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial
            color="#003322"
            emissive="#00ffaa"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            wireframe={false}
          />
        </mesh>

        {/* Outer shell */}
        <mesh>
          <sphereGeometry args={[3.2, 16, 16]} />
          <meshStandardMaterial
            color="#00ffaa"
            transparent
            opacity={0.1}
            wireframe={true}
            emissive="#00ffaa"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Data nodes on the surface */}
        {Array.from({ length: 12 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 12)
          const theta = Math.sqrt(12 * Math.PI) * phi
          const x = 3 * Math.cos(theta) * Math.sin(phi)
          const y = 3 * Math.sin(theta) * Math.sin(phi)
          const z = 3 * Math.cos(phi)

          return (
            <mesh key={i} position={[x, y, z]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial
                color="#00ffaa"
                emissive="#00ffaa"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          )
        })}

        {/* Core glow */}
        <pointLight color="#00ffaa" intensity={2} distance={10} />
      </group>

      {/* Orbital rings around the central core */}
      <group ref={orbitalRingRef}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[5, 0.1, 16, 100]} />
          <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6, 0.1, 16, 100]} />
          <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
          <torusGeometry args={[7, 0.05, 16, 100]} />
          <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={0.8} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Category platforms distributed in 3D space */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 12
        const x = Math.cos(angle) * radius
        const baseY = ((i % 3) - 1) * 8 // Distribute vertically
        const z = Math.sin(angle) * radius
        const categoryColor = Object.values(DEFAULT_CATEGORY_COLORS)[i % Object.values(DEFAULT_CATEGORY_COLORS).length]

        return (
          <group key={`platform-${i}`} position={[x, baseY, z]} ref={(el) => (nodePlatformRefs.current[i] = el)}>
            {/* Platform base */}
            <mesh receiveShadow>
              <cylinderGeometry args={[3, 3.5, 0.5, 6]} />
              <meshStandardMaterial
                color="#003322"
                emissive="#003322"
                emissiveIntensity={0.2}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Platform top */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[2.8, 3, 0.2, 6]} />
              <meshStandardMaterial
                color={categoryColor}
                emissive={categoryColor}
                emissiveIntensity={0.3}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Energy core */}
            <mesh position={[0, 0.5, 0]}>
              <torusGeometry args={[1, 0.2, 16, 32]} />
              <meshStandardMaterial color={categoryColor} emissive={categoryColor} emissiveIntensity={0.5} />
            </mesh>

            {/* Light source */}
            <pointLight color={categoryColor} intensity={1} distance={8} position={[0, 1, 0]} />

            {/* Holographic elements */}
            <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
              <meshBasicMaterial color={categoryColor} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color={categoryColor} />
            </mesh>
          </group>
        )
      })}

      {/* Data flow tubes connecting platforms to central core */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 12
        const x = Math.cos(angle) * radius
        const baseY = ((i % 3) - 1) * 8 // Match platform heights
        const z = Math.sin(angle) * radius
        const categoryColor = Object.values(DEFAULT_CATEGORY_COLORS)[i % Object.values(DEFAULT_CATEGORY_COLORS).length]

        // Create curved data flow paths
        const points = []
        const curveSegments = 20
        for (let j = 0; j <= curveSegments; j++) {
          const t = j / curveSegments
          const curveX = x * (1 - t)
          const curveY = baseY * (1 - t) + Math.sin(t * Math.PI * 0.5) * 3 // Curved path
          const curveZ = z * (1 - t)
          points.push(new THREE.Vector3(curveX, curveY, curveZ))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.TubeGeometry(curve, 20, 0.15, 8, false)

        return (
          <mesh key={`data-flow-${i}`} geometry={geometry} ref={(el) => (dataFlowRefs.current[i] = el)}>
            <meshStandardMaterial
              color={categoryColor}
              emissive={categoryColor}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}

      {/* Floating data cubes */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const radius = 5 + Math.random() * 15
        const x = Math.cos(angle) * radius
        const y = (Math.random() - 0.5) * 20
        const z = Math.sin(angle) * radius
        const size = 0.1 + Math.random() * 0.3
        const color = Object.values(DEFAULT_CATEGORY_COLORS)[i % Object.values(DEFAULT_CATEGORY_COLORS).length]

        return (
          <Float
            key={`data-cube-${i}`}
            speed={0.5 + Math.random() * 1}
            intensity={1 + Math.random() * 2}
            rotationIntensity={Math.random() * 2}
          >
            <mesh position={[x, y, z]}>
              <boxGeometry args={[size, size, size]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
          </Float>
        )
      })}

      {/* Energy beams */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        const x = Math.cos(angle) * 15
        const z = Math.sin(angle) * 15

        return (
          <group key={`energy-beam-${i}`} position={[x, -10, z]}>
            {/* Base */}
            <mesh>
              <cylinderGeometry args={[1, 1.5, 1, 8]} />
              <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={0.5} />
            </mesh>
            {/* Beam */}
            <mesh position={[0, 15, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 30, 8]} />
              <meshBasicMaterial color="#00ffaa" transparent opacity={0.7} />
            </mesh>
            {/* Top */}
            <mesh position={[0, 30, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color="#00ffaa" />
              <pointLight color="#00ffaa" intensity={2} distance={10} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Enhanced technical skill node
function TechSkillNode({
  position,
  name,
  category,
  level,
  color,
  index,
  totalNodes,
  onClick,
  isSelected,
  customCategories,
}) {
  const nodeRef = useRef()
  const coreRef = useRef()
  const ringsRef = useRef()
  const particlesRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Calculate node size based on skill level
  const nodeSize = 0.3 + (level / 100) * 0.7

  // Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const offset = (index / totalNodes) * Math.PI * 2

    if (nodeRef.current) {
      // Floating animation - more pronounced
      nodeRef.current.position.x = position[0] + Math.sin(t * 0.5 + offset) * 0.4
      nodeRef.current.position.y = position[1] + Math.cos(t * 0.3 + offset) * 0.3
      nodeRef.current.position.z = position[2] + Math.sin(t * 0.4 + offset) * 0.4

      // Scale effect when hovered or selected
      const targetScale = hovered || isSelected ? 1.3 : 1
      nodeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }

    if (coreRef.current) {
      // Core rotation
      coreRef.current.rotation.y = t * 0.3
      coreRef.current.rotation.z = t * 0.2

      // Pulsing effect
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.8 + offset) * 0.1)
    }

    if (ringsRef.current) {
      // Rings rotation
      ringsRef.current.rotation.x = t * 0.4
      ringsRef.current.rotation.y = t * 0.3
    }

    if (particlesRef.current) {
      // Particles rotation
      particlesRef.current.rotation.y = t * 0.5
      particlesRef.current.rotation.x = Math.sin(t * 0.3) * 0.5
    }
  })

  return (
    <group
      position={position}
      onClick={() => onClick(index)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={nodeRef}>
        {/* Main core - more complex 3D structure */}
        <group ref={coreRef}>
          {/* Inner core */}
          <mesh castShadow>
            <dodecahedronGeometry args={[nodeSize * 0.6, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered || isSelected ? 1 : 0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Outer shell */}
          <mesh castShadow>
            <dodecahedronGeometry args={[nodeSize * 0.9, 0]} />
            <meshStandardMaterial color={color} transparent opacity={0.3} wireframe={true} />
          </mesh>

          {/* Data nodes on surface */}
          {Array.from({ length: 6 }).map((_, i) => {
            const phi = Math.acos(-1 + (2 * i) / 6)
            const theta = Math.sqrt(6 * Math.PI) * phi
            const x = nodeSize * 0.6 * Math.cos(theta) * Math.sin(phi)
            const y = nodeSize * 0.6 * Math.sin(theta) * Math.sin(phi)
            const z = nodeSize * 0.6 * Math.cos(phi)

            return (
              <mesh key={i} position={[x, y, z]}>
                <boxGeometry args={[nodeSize * 0.1, nodeSize * 0.1, nodeSize * 0.1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
              </mesh>
            )
          })}
        </group>

        {/* Rotating rings - more complex */}
        <group ref={ringsRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[nodeSize * 1.2, nodeSize * 0.05, 8, 32]} />
            <meshStandardMaterial color={color} transparent opacity={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[nodeSize * 1.4, nodeSize * 0.03, 8, 32]} />
            <meshStandardMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Orbiting particles */}
        <group ref={particlesRef}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const orbitRadius = nodeSize * 1.8
            const x = Math.cos(angle) * orbitRadius
            const y = Math.sin(angle) * 0.5 * orbitRadius
            const z = Math.sin(angle) * orbitRadius
            return (
              <mesh key={i} position={[x, y, z]}>
                <tetrahedronGeometry args={[nodeSize * 0.08, 0]} />
                <meshBasicMaterial color={color} />
              </mesh>
            )
          })}
        </group>

        {/* Skill level indicator - more 3D */}
        <mesh position={[0, nodeSize * 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[nodeSize * 0.8, nodeSize * 0.1, 8, 32, (level / 100) * Math.PI * 2]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>

        {/* Energy beam connecting to the node */}
        <mesh position={[0, -nodeSize * 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[nodeSize * 0.05, nodeSize * 0.05, nodeSize * 4, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>

        {/* Center glow */}
        <pointLight color={color} intensity={2} distance={nodeSize * 6} />
      </group>

      {/* Skill name - always face camera */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, nodeSize * 2.5, 0]}>
        <Text
          color="white"
          fontSize={0.6}
          maxWidth={6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
          outlineOpacity={1}
        >
          {name}
        </Text>
      </Billboard>

      {/* Category indicator */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, nodeSize * 1.8, 0]}>
        <Text color="#aaaaaa" fontSize={0.4} maxWidth={6} textAlign="center" anchorX="center" anchorY="middle">
          {category}
        </Text>
      </Billboard>

      {/* Detail panel when selected */}
      {isSelected && (
        <Html position={[nodeSize * 4, 0, 0]} transform occlude>
          <div
            style={{
              width: "200px",
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: "10px",
              padding: "15px",
              color: "white",
              border: `2px solid ${color}`,
              boxShadow: `0 0 20px ${color}`,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color }}>{name}</h3>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>Category: {category}</p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>Proficiency: {level}%</p>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "3px",
                marginTop: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${level}%`,
                  height: "100%",
                  backgroundColor: color,
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Soft skills node
function SoftSkillNode({ position, name, level, color, index, totalNodes, onClick, isSelected }) {
  const nodeRef = useRef()
  const ringRef = useRef()
  const coreRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Calculate node size based on skill level
  const nodeSize = 0.4 + (level / 100) * 0.8

  // Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const offset = (index / totalNodes) * Math.PI * 2

    if (nodeRef.current) {
      // Floating animation
      nodeRef.current.position.y = position[1] + Math.sin(t * 0.5 + offset) * 0.5

      // Rotation
      nodeRef.current.rotation.y = t * 0.2

      // Scale effect when hovered or selected
      const targetScale = hovered || isSelected ? 1.3 : 1
      nodeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }

    if (ringRef.current) {
      // Rotating ring
      ringRef.current.rotation.z = t * 0.5
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    }

    if (coreRef.current) {
      // Pulsing core
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.8 + offset) * 0.2)
    }
  })

  return (
    <group
      position={position}
      onClick={() => onClick(index)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={nodeRef}>
        {/* Main node - Crystal structure */}
        <group>
          {/* Core crystal */}
          <mesh ref={coreRef} castShadow>
            <dodecahedronGeometry args={[nodeSize * 0.7, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered || isSelected ? 1 : 0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Outer crystal shell */}
          <mesh castShadow>
            <dodecahedronGeometry args={[nodeSize, 0]} />
            <meshStandardMaterial color={color} transparent opacity={0.3} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rotating rings */}
        <group>
          <mesh ref={ringRef} position={[0, 0, 0]}>
            <torusGeometry args={[nodeSize * 1.3, nodeSize * 0.1, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[nodeSize * 1.1, nodeSize * 0.05, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Skill level indicator - 3D arc */}
        <mesh position={[0, nodeSize * 1.2, 0]}>
          <torusGeometry args={[nodeSize * 0.8, nodeSize * 0.15, 8, 32, (level / 100) * Math.PI * 2]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>

        {/* Energy particles */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2
          const orbitRadius = nodeSize * 1.5
          const x = Math.cos(angle) * orbitRadius
          const z = Math.sin(angle) * orbitRadius
          return (
            <Float key={i} speed={1 + i * 0.2} intensity={0.5} rotationIntensity={0.2}>
              <mesh position={[x, 0, z]}>
                <sphereGeometry args={[nodeSize * 0.1, 8, 8]} />
                <meshBasicMaterial color={color} />
              </mesh>
            </Float>
          )
        })}

        {/* Center glow */}
        <pointLight color={color} intensity={2} distance={5} />
      </group>

      {/* Skill name - always face camera */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, nodeSize * 2, 0]}>
        <Text
          color="white"
          fontSize={0.6}
          maxWidth={6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
          outlineOpacity={1}
        >
          {name}
        </Text>
      </Billboard>

      {/* Proficiency indicator */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, nodeSize * 1.4, 0]}>
        <Text color="#aaaaaa" fontSize={0.4} maxWidth={6} textAlign="center" anchorX="center" anchorY="middle">
          {`${level}%`}
        </Text>
      </Billboard>

      {/* Detail panel when selected */}
      {isSelected && (
        <Html position={[nodeSize * 4, 0, 0]} transform occlude>
          <div
            style={{
              width: "200px",
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: "10px",
              padding: "15px",
              color: "white",
              border: `2px solid ${color}`,
              boxShadow: `0 0 20px ${color}`,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color }}>{name}</h3>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>Proficiency: {level}%</p>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "3px",
                marginTop: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${level}%`,
                  height: "100%",
                  backgroundColor: color,
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Enhanced 3D technical skills connections
function TechSkillConnections({ skills, selectedIndex, onSelectSkill, customCategories }) {
  const linesRef = useRef()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Create positions for skills in a 3D network layout
  const skillPositions = useMemo(() => {
    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})

    const positions = []
    const categories = Object.keys(skillsByCategory)

    // Position skills by category in a 3D space with more vertical variation
    categories.forEach((category, categoryIndex) => {
      const categorySkills = skillsByCategory[category]
      const categoryAngle = (categoryIndex / categories.length) * Math.PI * 2
      const categoryRadius = 12
      const categoryX = Math.cos(categoryAngle) * categoryRadius
      const categoryZ = Math.sin(categoryAngle) * categoryRadius
      const categoryY = ((categoryIndex % 3) - 1) * 8 // Distribute categories vertically

      // Position skills within each category with more 3D distribution
      categorySkills.forEach((skill, skillIndex) => {
        const skillAngle = (skillIndex / categorySkills.length) * Math.PI * 2
        const skillRadius = 5
        // More 3D distribution
        const heightVariation = Math.sin(skillIndex * 0.8) * 3
        const x = categoryX + Math.cos(skillAngle) * skillRadius
        const y = categoryY + heightVariation + Math.cos(skillIndex * 0.7) * 2
        const z = categoryZ + Math.sin(skillAngle) * skillRadius

        positions.push(new THREE.Vector3(x, y, z))
      })
    })

    return positions
  }, [skills])

  // Create connections between vertices - enhanced for 3D visual
  const linePositions = useMemo(() => {
    const positions = []
    let skillIndex = 0

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})

    const categories = Object.keys(skillsByCategory)

    // Connect skills within the same category
    categories.forEach((category) => {
      const categorySkills = skillsByCategory[category]
      const categoryStartIndex = skillIndex

      // Connect each skill to the next in the same category (circular)
      for (let i = 0; i < categorySkills.length; i++) {
        const currentIndex = categoryStartIndex + i
        const nextIndex = categoryStartIndex + ((i + 1) % categorySkills.length)

        if (skillPositions[currentIndex] && skillPositions[nextIndex]) {
          positions.push(
            skillPositions[currentIndex].x,
            skillPositions[currentIndex].y,
            skillPositions[currentIndex].z,
            skillPositions[nextIndex].x,
            skillPositions[nextIndex].y,
            skillPositions[nextIndex].z,
          )
        }
      }

      skillIndex += categorySkills.length
    })

    // Connect between categories - more 3D paths
    let prevCategoryStartIndex = 0
    for (let i = 1; i < categories.length; i++) {
      const currentCategoryStartIndex = prevCategoryStartIndex + skillsByCategory[categories[i - 1]].length

      if (skillPositions[prevCategoryStartIndex] && skillPositions[currentCategoryStartIndex]) {
        positions.push(
          skillPositions[prevCategoryStartIndex].x,
          skillPositions[prevCategoryStartIndex].y,
          skillPositions[prevCategoryStartIndex].z,
          skillPositions[currentCategoryStartIndex].x,
          skillPositions[currentCategoryStartIndex].y,
          skillPositions[currentCategoryStartIndex].z,
        )
      }

      prevCategoryStartIndex = currentCategoryStartIndex
    }

    // Connect first and last categories to complete the circle
    const firstCategoryIndex = 0
    const lastCategoryStartIndex = prevCategoryStartIndex

    if (skillPositions[firstCategoryIndex] && skillPositions[lastCategoryStartIndex]) {
      positions.push(
        skillPositions[firstCategoryIndex].x,
        skillPositions[firstCategoryIndex].y,
        skillPositions[firstCategoryIndex].z,
        skillPositions[lastCategoryStartIndex].x,
        skillPositions[lastCategoryStartIndex].y,
        skillPositions[lastCategoryStartIndex].z,
      )
    }

    // Add cross-connections for better 3D network effect
    const crossConnectionCount = Math.min(30, Math.floor(skillPositions.length / 2))
    for (let i = 0; i < crossConnectionCount; i++) {
      const idx1 = Math.floor(Math.random() * skillPositions.length)
      const idx2 = Math.floor(Math.random() * skillPositions.length)

      if (idx1 !== idx2 && skillPositions[idx1] && skillPositions[idx2]) {
        positions.push(
          skillPositions[idx1].x,
          skillPositions[idx1].y,
          skillPositions[idx1].z,
          skillPositions[idx2].x,
          skillPositions[idx2].y,
          skillPositions[idx2].z,
        )
      }
    }

    return new Float32Array(positions)
  }, [skillPositions, skills])

  // Animation for connections
  useFrame(({ clock }) => {
    if (linesRef.current) {
      const t = clock.getElapsedTime()
      linesRef.current.material.opacity = 0.3 + Math.sin(t * 0.5) * 0.1
      linesRef.current.material.color.setRGB(
        0.0 + Math.sin(t * 0.2) * 0.1,
        1.0 + Math.sin(t * 0.3) * 0.1,
        0.5 + Math.sin(t * 0.4) * 0.1,
      )
    }
  })

  return (
    <group>
      {/* Environment */}
      <TechEnvironment3D />

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ffaa" transparent opacity={0.3} />
      </lineSegments>

      {/* Skill nodes */}
      {skills.map((skill, index) => {
        if (!skillPositions[index]) return null

        // Get color based on category
        const customCategory = customCategories.find((cat) => cat.name === skill.category)
        const categoryColor = customCategory?.color || DEFAULT_CATEGORY_COLORS[skill.category] || "#00aaff"

        return (
          <TechSkillNode
            key={index}
            position={[skillPositions[index].x, skillPositions[index].y, skillPositions[index].z]}
            name={skill.name}
            category={skill.category}
            level={skill.level}
            color={categoryColor}
            index={index}
            totalNodes={skills.length}
            onClick={onSelectSkill}
            isSelected={selectedIndex === index}
            customCategories={customCategories}
          />
        )
      })}
    </group>
  )
}

// Soft skills visualization
function SoftSkills3DEnvironment() {
  const groupRef = useRef()
  const coreRef = useRef()
  const outerRingRef = useRef()
  const innerRingRef = useRef()
  const energyBeamRefs = useRef([])
  const floatingPlatformRefs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle overall rotation
      groupRef.current.rotation.y = t * 0.05
    }

    if (coreRef.current) {
      // Pulsing core
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.1)
      coreRef.current.rotation.y = t * 0.2
      coreRef.current.rotation.z = t * 0.1
    }

    if (outerRingRef.current) {
      // Rotating outer ring
      outerRingRef.current.rotation.z = t * 0.1
    }

    if (innerRingRef.current) {
      // Counter-rotating inner ring
      innerRingRef.current.rotation.z = -t * 0.15
    }

    // Animate energy beams
    energyBeamRefs.current.forEach((beam, i) => {
      if (beam) {
        const offset = i * 0.5
        beam.scale.y = 1 + Math.sin(t * 0.7 + offset) * 0.3
        beam.material.opacity = 0.6 + Math.sin(t * 0.5 + offset) * 0.2
      }
    })

    // Animate floating platforms
    floatingPlatformRefs.current.forEach((platform, i) => {
      if (platform) {
        const offset = i * 0.7
        platform.position.y = Math.sin(t * 0.3 + offset) * 2
        platform.rotation.y = t * 0.1 + offset
        platform.rotation.z = Math.sin(t * 0.2 + offset) * 0.1
      }
    })
  })

  // Create a truly 3D environment for soft skills
  return (
    <group ref={groupRef}>
      {/* Central core structure */}
      <group position={[0, 0, 0]}>
        {/* Base platform */}
        <mesh position={[0, -5, 0]} receiveShadow>
          <cylinderGeometry args={[15, 15, 1, 6]} />
          <meshStandardMaterial color="#220033" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Core structure */}
        <group ref={coreRef} position={[0, 0, 0]}>
          {/* Central crystal */}
          <mesh castShadow>
            <octahedronGeometry args={[4, 0]} />
            <meshStandardMaterial
              color="#aa00ff"
              emissive="#aa00ff"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <pointLight color="#aa00ff" intensity={5} distance={20} />
        </group>

        {/* Rotating rings */}
        <group position={[0, 0, 0]}>
          <mesh ref={outerRingRef} position={[0, 0, 0]}>
            <torusGeometry args={[8, 0.4, 16, 32]} />
            <meshStandardMaterial
              color="#ff00aa"
              emissive="#ff00aa"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh ref={innerRingRef} position={[0, 0, 0]}>
            <torusGeometry args={[6, 0.3, 16, 32]} />
            <meshStandardMaterial
              color="#aa00ff"
              emissive="#aa00ff"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Vertical energy beams */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = 12
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <group key={`beam-${i}`} position={[x, -5, z]}>
              {/* Base */}
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[1, 1.5, 1, 6]} />
                <meshStandardMaterial
                  color="#ff00aa"
                  emissive="#ff00aa"
                  emissiveIntensity={0.5}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Energy beam */}
              <mesh position={[0, 8, 0]} ref={(el) => (energyBeamRefs.current[i] = el)}>
                <cylinderGeometry args={[0.2, 0.2, 15, 8]} />
                <meshBasicMaterial color="#ff00aa" transparent opacity={0.7} />
              </mesh>
              {/* Top emitter */}
              <mesh position={[0, 15.5, 0]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial
                  color="#ff00aa"
                  emissive="#ff00aa"
                  emissiveIntensity={0.8}
                  metalness={0.9}
                  roughness={0.1}
                />
                <pointLight color="#ff00aa" intensity={2} distance={10} />
              </mesh>
            </group>
          )
        })}

        {/* Floating platforms for skill nodes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = 10
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = 5 + (i % 3) * 3 // Varying heights

          return (
            <group key={`platform-${i}`} position={[x, y, z]} ref={(el) => (floatingPlatformRefs.current[i] = el)}>
              {/* Platform */}
              <mesh>
                <boxGeometry args={[3, 0.5, 3]} />
                <meshStandardMaterial
                  color="#440066"
                  emissive="#440066"
                  emissiveIntensity={0.3}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>

              {/* Decorative elements */}
              <mesh position={[0, 0.5, 0]}>
                <torusGeometry args={[1, 0.1, 8, 16]} />
                <meshStandardMaterial color="#aa00ff" emissive="#aa00ff" emissiveIntensity={0.5} />
              </mesh>

              {/* Light */}
              <pointLight color="#aa00ff" intensity={1} distance={5} position={[0, 1, 0]} />
            </group>
          )
        })}

        {/* Connecting energy beams between platforms and core */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = 10
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = 5 + (i % 3) * 3 // Matching platform heights

          // Create points for curved beam
          const points = []
          const curveSegments = 20
          for (let j = 0; j <= curveSegments; j++) {
            const t = j / curveSegments
            // Create a curved path from platform to core
            const curveX = x * (1 - t)
            const curveY = y * (1 - t) + Math.sin(t * Math.PI) * 2 // Arc upward
            const curveZ = z * (1 - t)
            points.push(new THREE.Vector3(curveX, curveY, curveZ))
          }

          const curve = new THREE.CatmullRomCurve3(points)
          const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false)

          return (
            <mesh key={`energy-connection-${i}`} geometry={geometry}>
              <meshBasicMaterial color="#aa00ff" transparent opacity={0.5} />
            </mesh>
          )
        })}

        {/* Additional floating elements */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 7 + Math.random() * 8
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = Math.random() * 15 - 5

          return (
            <Float key={`float-element-${i}`} speed={0.5 + Math.random() * 1} intensity={1}>
              <mesh position={[x, y, z]}>
                <tetrahedronGeometry args={[0.3 + Math.random() * 0.3, 0]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#aa00ff" : "#ff00aa"}
                  emissive={i % 2 === 0 ? "#aa00ff" : "#ff00aa"}
                  emissiveIntensity={0.5}
                />
              </mesh>
            </Float>
          )
        })}
      </group>
    </group>
  )
}

// Soft skills connections
function SoftSkillConnections({ skills, selectedIndex, onSelectSkill }) {
  // Colors for soft skills
  const softSkillColors = ["#ff3366", "#ff9500", "#aa00ff", "#00aaff", "#00ff88", "#ffcc00"]

  // Create positions for skills in a 3D space
  const skillPositions = useMemo(() => {
    return skills.map((skill, index) => {
      // Position skills on floating platforms
      const angle = (index / skills.length) * Math.PI * 2
      const radius = 10
      const heightFactor = Math.sin((index / skills.length) * Math.PI * 4)
      const y = 5 + (index % 3) * 3 // Match platform heights
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      return new THREE.Vector3(x, y, z)
    })
  }, [skills])

  return (
    <group>
      {/* 3D Environment */}
      <SoftSkills3DEnvironment />

      {/* Skill nodes */}
      {skills.map((skill, index) => {
        if (!skillPositions[index]) return null

        // Get color from array
        const color = softSkillColors[index % softSkillColors.length]

        return (
          <SoftSkillNode
            key={index}
            position={[skillPositions[index].x, skillPositions[index].y, skillPositions[index].z]}
            name={skill.name}
            level={skill.level}
            color={color}
            index={index}
            totalNodes={skills.length}
            onClick={onSelectSkill}
            isSelected={selectedIndex === index}
          />
        )
      })}
    </group>
  )
}

// Post-processing effects
function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={1.0} luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      <ChromaticAberration offset={[0.0005, 0.0005]} blendFunction={BlendFunction.NORMAL} opacity={0.2} />
      <Noise opacity={0.02} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

// Main scene component
function SkillsScene({ activeTab, technicalSkills, softSkills, customCategories }) {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null)

  // Reset selected skill when tab changes
  useEffect(() => {
    setSelectedSkillIndex(null)
  }, [activeTab])

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <PerspectiveCamera makeDefault position={[0, 5, 25]} fov={60} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Background particles */}
      <ParticleField count={3000} />

      {/* Technical skills visualization */}
      {activeTab === "technical" && (
        <TechSkillConnections
          skills={technicalSkills}
          selectedIndex={selectedSkillIndex}
          onSelectSkill={setSelectedSkillIndex}
          customCategories={customCategories}
        />
      )}

      {/* Soft skills visualization */}
      {activeTab === "soft" && (
        <SoftSkillConnections
          skills={softSkills}
          selectedIndex={selectedSkillIndex}
          onSelectSkill={setSelectedSkillIndex}
        />
      )}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={selectedSkillIndex === null}
        autoRotateSpeed={activeTab === "technical" ? 0.3 : 0.2}
        minDistance={15}
        maxDistance={40}
        minPolarAngle={Math.PI / 8} // Allow more vertical rotation
        maxPolarAngle={(Math.PI * 7) / 8} // Allow more vertical rotation
      />

      {/* Post-processing effects */}
      <Effects />
    </>
  )
}

export default function Skills3D({ activeTab, technicalSkills = [], softSkills = [], customCategories = [] }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Add a global error handler for WebGL context loss
    const handleError = () => {
      console.error("WebGL context lost or error occurred")
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="h-[500px] w-full rounded-xl bg-muted/20 flex items-center justify-center">
        <p className="text-foreground/70">3D visualization unavailable</p>
      </div>
    )
  }

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <Suspense
        fallback={
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
            <p className="text-foreground/70">Loading advanced visualization...</p>
          </div>
        }
      >
        <Canvas>
          <SkillsScene
            activeTab={activeTab}
            technicalSkills={technicalSkills}
            softSkills={softSkills}
            customCategories={customCategories}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
