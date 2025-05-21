"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import the 3D component with no SSR
const Projects3DDynamic = dynamic(() => import("./projects-3d"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted/20"></div>,
})

export default function Projects3DWrapper({ projects }) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser) {
    return <div className="h-[500px] w-full bg-muted/20"></div>
  }

  return <Projects3DDynamic projects={projects} />
}
