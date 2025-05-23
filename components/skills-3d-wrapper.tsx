"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import the 3D component with no SSR
const Skills3DDynamic = dynamic(() => import("./skills-3d"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-xl bg-muted/20 flex items-center justify-center">
      <div className="text-foreground/70">Loading interactive skills visualization...</div>
    </div>
  ),
})

export default function Skills3DWrapper({ activeTab, technicalSkills = [], softSkills = [], customCategories = [] }) {
  const [isBrowser, setIsBrowser] = useState(false)
  const [use3D, setUse3D] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsBrowser(true)

    // Check if mobile
    const checkMobile = () => {
      return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent)
    }

    setIsMobile(checkMobile())

    // Only check WebGL support if not on mobile
    if (!checkMobile()) {
      try {
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        if (!gl) {
          setUse3D(false)
        }
      } catch (e) {
        setUse3D(false)
      }
    } else {
      setUse3D(false)
    }

    // Handle resize
    const handleResize = () => {
      setIsMobile(checkMobile())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isBrowser || isMobile) {
    // Return null for mobile - we'll handle the mobile view in the skills.tsx component
    return null
  }

  if (!use3D) {
    return (
      <div className="h-[500px] w-full rounded-xl bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-white mb-6">
          {activeTab === "technical" ? "Technical Skills" : "Soft Skills"}
        </h3>
        <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
          {(activeTab === "technical" ? technicalSkills : softSkills).map((skill) => (
            <span
              key={skill.name}
              className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium border border-white/10"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Skills3DDynamic
      activeTab={activeTab}
      technicalSkills={technicalSkills}
      softSkills={softSkills}
      customCategories={customCategories}
    />
  )
}
