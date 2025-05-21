"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

export default function ProjectsShowcase({ projects = [] }) {
  // Handle empty projects array
  if (!projects || projects.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-white/70 text-lg">No projects to display</p>
      </div>
    )
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullView, setIsFullView] = useState(false)

  // Ensure activeIndex is within bounds
  useEffect(() => {
    if (activeIndex >= projects.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, projects.length])

  // Safely get the active project with fallback
  const activeProject = projects[activeIndex] || {
    title: "Project Not Found",
    category: "Unknown",
    description: "Project details unavailable",
    features: [],
    technologies: [],
    image: "/placeholder.svg",
    github: "#",
    demo: "#",
  }

  // Navigate to previous project
  const prevProject = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  // Navigate to next project
  const nextProject = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevProject()
      if (e.key === "ArrowRight") nextProject()
      if (e.key === "Escape") setIsFullView(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div
      className={`relative w-full ${isFullView ? "h-screen fixed inset-0 z-50 bg-black" : "h-[600px]"} overflow-hidden rounded-xl`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  filter: "blur(60px)",
                  opacity: Math.random() * 0.5,
                  animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Toggle full view button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-20 bg-black/30 text-white hover:bg-black/50"
        onClick={() => setIsFullView(!isFullView)}
      >
        <Maximize2 className="h-5 w-5" />
      </Button>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-12 w-12 rounded-full"
        onClick={prevProject}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-12 w-12 rounded-full"
        onClick={nextProject}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Project indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative h-full w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-16"
          >
            {/* Project image/preview */}
            <motion.div
              className="w-full md:w-1/2 h-[200px] md:h-[400px] relative rounded-xl overflow-hidden shadow-2xl"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 mix-blend-overlay z-10" />
              <img
                src={activeProject.image || "/placeholder.svg"}
                alt={activeProject.title || "Project image"}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />

              {/* Floating tech badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[80%]">
                {(activeProject.technologies || []).slice(0, 3).map((tech, i) => (
                  <Badge key={i} className="bg-black/70 text-white backdrop-blur-sm border-none">
                    {tech}
                  </Badge>
                ))}
                {(activeProject.technologies || []).length > 3 && (
                  <Badge className="bg-black/70 text-white backdrop-blur-sm border-none">
                    +{(activeProject.technologies || []).length - 3}
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Project details */}
            <motion.div
              className="w-full md:w-1/2 md:pl-12 mt-8 md:mt-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="space-y-1">
                <h3 className="text-3xl font-bold text-white">{activeProject.title || "Untitled Project"}</h3>
                <p className="text-primary/90 font-medium">{activeProject.category || "Uncategorized"}</p>
              </motion.div>

              <motion.p variants={itemVariants} className="mt-4 text-white/80 line-clamp-4 md:line-clamp-none">
                {activeProject.description || "No description available"}
              </motion.p>

              {(activeProject.features || []).length > 0 && (
                <motion.div variants={itemVariants} className="mt-6">
                  <h4 className="text-white font-semibold mb-2">Key Features</h4>
                  <ul className="space-y-2">
                    {(activeProject.features || []).map((feature, i) => (
                      <motion.li key={i} variants={itemVariants} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2" />
                        <span className="text-white/70">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mt-8 flex space-x-4">
                <Button className="bg-white text-black hover:bg-white/90">
                  <Github className="mr-2 h-4 w-4" /> View Code
                </Button>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8 flex items-center justify-between">
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={prevProject}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                </div>
                <div className="text-white/50 text-sm">
                  {activeIndex + 1} / {projects.length}
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={nextProject}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
