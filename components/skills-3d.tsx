"use client"

import { useRef, useMemo, Suspense, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, PerspectiveCamera, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { technicalSkills, softSkills } from "./skills-data"

// Background stars
function Stars({ count = 300 }) {
  const pointsRef = useRef()

  // Create star positions and sizes
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 50
      positions[i3 + 2] = (Math.random() - 0.5) * 50
      sizes[i] = Math.random() * 0.5 + 0.1
    }

    return [positions, sizes]
  }, [count])

  // Slow rotation of stars
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// Update the GeometricSkills component to enhance the visualization
function GeometricSkills({ activeTab }) {
  const groupRef = useRef()
  const linesRef = useRef()
  const skills = activeTab === "technical" ? technicalSkills : softSkills

  // Group technical skills by category
  const skillsByCategory = useMemo(() => {
    if (activeTab !== "technical") return null

    return technicalSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})
  }, [activeTab])

  // Create positions for skills based on active tab
  const skillPositions = useMemo(() => {
    const positions = []

    if (activeTab === "technical") {
      // Technical skills use a multi-layer orbital system based on categories
      const categories = Object.keys(skillsByCategory)
      const baseRadius = 8
      const layerHeight = 3

      categories.forEach((category, categoryIndex) => {
        const skills = skillsByCategory[category]
        const skillCount = skills.length
        const layerY = (categoryIndex - (categories.length - 1) / 2) * layerHeight
        const layerRadius = baseRadius * (1 + categoryIndex * 0.1) // Slightly increasing radius per layer

        // Position skills in a circle for each category layer
        skills.forEach((skill, skillIndex) => {
          const angle = (skillIndex / skillCount) * Math.PI * 2
          const x = Math.cos(angle) * layerRadius
          const z = Math.sin(angle) * layerRadius

          positions.push(new THREE.Vector3(x, layerY, z))
        })
      })
    } else {
      // Soft skills use a spiral layout in 3D space
      const count = skills.length
      const radius = 8
      const spiralHeight = 10
      const turns = 1.5

      for (let i = 0; i < count; i++) {
        // Calculate position on a spiral
        const angle = (i / count) * Math.PI * 2 * turns
        const heightFactor = i / (count - 1) // 0 to 1
        const spiralRadius = radius * (1 - heightFactor * 0.3) // Slightly decreasing radius

        const x = Math.cos(angle) * spiralRadius
        const y = (heightFactor - 0.5) * spiralHeight // Center the spiral vertically
        const z = Math.sin(angle) * spiralRadius

        positions.push(new THREE.Vector3(x, y, z))
      }
    }

    return positions
  }, [activeTab, skillsByCategory, skills])

  // Create connections between vertices
  const linePositions = useMemo(() => {
    const positions = []

    if (activeTab === "technical") {
      // Technical skills use a more complex connection pattern based on categories
      const categories = Object.keys(skillsByCategory)
      let skillIndex = 0

      // Connect skills within the same category
      categories.forEach((category) => {
        const skills = skillsByCategory[category]
        const categoryStartIndex = skillIndex

        // Connect each skill to the next in the same category (circular)
        for (let i = 0; i < skills.length; i++) {
          const currentIndex = categoryStartIndex + i
          const nextIndex = categoryStartIndex + ((i + 1) % skills.length)

          positions.push(
            skillPositions[currentIndex].x,
            skillPositions[currentIndex].y,
            skillPositions[currentIndex].z,
            skillPositions[nextIndex].x,
            skillPositions[nextIndex].y,
            skillPositions[nextIndex].z,
          )
        }

        skillIndex += skills.length
      })

      // Connect between categories (connect first skill of each category to first skill of next category)
      let prevCategoryStartIndex = 0
      for (let i = 1; i < categories.length; i++) {
        const currentCategoryStartIndex = prevCategoryStartIndex + skillsByCategory[categories[i - 1]].length

        positions.push(
          skillPositions[prevCategoryStartIndex].x,
          skillPositions[prevCategoryStartIndex].y,
          skillPositions[prevCategoryStartIndex].z,
          skillPositions[currentCategoryStartIndex].x,
          skillPositions[currentCategoryStartIndex].y,
          skillPositions[currentCategoryStartIndex].z,
        )

        prevCategoryStartIndex = currentCategoryStartIndex
      }

      // Add some cross-connections between random skills for visual interest
      const crossConnectionCount = Math.min(15, Math.floor(skillPositions.length / 2))
      for (let i = 0; i < crossConnectionCount; i++) {
        const idx1 = Math.floor(Math.random() * skillPositions.length)
        const idx2 = Math.floor(Math.random() * skillPositions.length)

        if (idx1 !== idx2) {
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
    } else {
      // Soft skills use a spiral connection pattern
      // Connect each node to its neighbors in the spiral
      for (let i = 0; i < skillPositions.length - 1; i++) {
        positions.push(
          skillPositions[i].x,
          skillPositions[i].y,
          skillPositions[i].z,
          skillPositions[i + 1].x,
          skillPositions[i + 1].y,
          skillPositions[i + 1].z,
        )
      }

      // Connect first and last to complete the spiral
      positions.push(
        skillPositions[0].x,
        skillPositions[0].y,
        skillPositions[0].z,
        skillPositions[skillPositions.length - 1].x,
        skillPositions[skillPositions.length - 1].y,
        skillPositions[skillPositions.length - 1].z,
      )

      // Add some cross connections for visual interest
      const crossConnections = Math.min(5, Math.floor(skillPositions.length / 3))
      for (let i = 0; i < crossConnections; i++) {
        const idx1 = Math.floor(Math.random() * skillPositions.length)
        const idx2 = (idx1 + Math.floor(skillPositions.length / 2)) % skillPositions.length

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
  }, [skillPositions, activeTab, skillsByCategory])

  // Animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (activeTab === "technical") {
        // For technical skills, rotate around Y axis with a pulsing effect
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
        // Add a subtle breathing effect to the entire structure
        const breathingScale = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03
        groupRef.current.scale.set(breathingScale, breathingScale, breathingScale)
      } else {
        // For soft skills, rotate with a slight wobble
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
        groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
      }
    }
  })

  // Get skill color based on category or index
  const getSkillColor = (skill, index) => {
    if (activeTab === "technical") {
      // Color based on category
      const categoryColors = {
        Languages: "#3b82f6", // Blue
        Frameworks: "#8b5cf6", // Purple
        Databases: "#10b981", // Green
        Web: "#f43f5e", // Red
        Advanced: "#f59e0b", // Amber
        Data: "#06b6d4", // Cyan
      }

      return categoryColors[skill.category] || "#6366f1"
    } else {
      // Soft skills colors - gradient from green to purple
      const colors = ["#10b981", "#06b6d4", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e"]
      return colors[index % colors.length]
    }
  }

  // Calculate node size based on skill level
  const getNodeSize = (level) => {
    return 0.5 + (level / 100) * 0.5
  }

  return (
    <group ref={groupRef}>
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
        <lineBasicMaterial color={activeTab === "technical" ? "#3b82f6" : "#10b981"} transparent opacity={0.3} />
      </lineSegments>

      {/* Skill nodes */}
      {skills.map((skill, index) => {
        const position = skillPositions[index]
        const nodeSize = getNodeSize(skill.level)
        const color = getSkillColor(skill, index)

        // Text position and orientation
        const textPosition = [nodeSize * 1.8, 0, 0]

        return (
          <group key={index} position={[position.x, position.y, position.z]}>
            {/* Skill sphere with glow effect */}
            <mesh>
              <sphereGeometry args={[nodeSize, 32, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>

            {/* Outer glow */}
            <mesh>
              <sphereGeometry args={[nodeSize * 1.2, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.15} />
            </mesh>

            {/* Skill text */}
            <Text
              position={textPosition}
              color="#ffffff"
              fontSize={0.7}
              maxWidth={6}
              anchorX="left"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {skill.name}
            </Text>

            {/* Show category for technical skills */}
            {activeTab === "technical" && (
              <Text
                position={[textPosition[0], textPosition[1] - 0.8, textPosition[2]]}
                color="#aaaaaa"
                fontSize={0.4}
                maxWidth={6}
                anchorX="left"
                anchorY="middle"
              >
                {skill.category}
              </Text>
            )}
          </group>
        )
      })}
    </group>
  )
}

function SkillsScene({ activeTab }) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />

      {/* Background stars */}
      <Stars />

      {/* Geometric skills visualization */}
      <GeometricSkills activeTab={activeTab} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={activeTab === "technical" ? 0.5 : 0.3}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
      />
    </>
  )
}

export default function Skills3D({ activeTab }) {
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
      <Suspense fallback={<div className="h-full w-full bg-muted/20"></div>}>
        <Canvas>
          <SkillsScene activeTab={activeTab} />
        </Canvas>
      </Suspense>
    </div>
  )
}
