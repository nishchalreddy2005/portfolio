"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { PresentationControls, Environment, ContactShadows, Html } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"

function Model({ project, ...props }) {
  const group = useRef()

  // Use a simple cube as a placeholder for the project
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 3]} />
        <meshStandardMaterial color="#f3f4f6" metalness={0.5} roughness={0.2} />

        <Html
          transform
          wrapperClass="htmlScreen"
          distanceFactor={1.5}
          position={[0, 0.15, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          className="w-full h-full"
        >
          <div className="w-[280px] h-[180px] overflow-hidden rounded-lg bg-white p-2">
            <div className="relative h-24 w-full overflow-hidden rounded-md">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
            </div>

            <div className="p-2">
              <h3 className="text-sm font-bold text-gray-900 truncate">{project.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{project.description}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-[8px] py-0 h-4">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-[8px] py-0 h-4">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

export default function Projects3D({ projects }) {
  return (
    <div className="h-[500px] w-full">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        <PresentationControls
          global
          zoom={0.8}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
            {projects.map((project, i) => (
              <Model
                key={project.id}
                project={project}
                position={[i % 2 === 0 ? -3 : 3, 0, i < 2 ? -2 : 2]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.8}
              />
            ))}
          </group>
        </PresentationControls>

        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={1.5} far={4.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
