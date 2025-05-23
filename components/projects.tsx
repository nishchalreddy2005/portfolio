"use client"

import { CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Linkedin, Users, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import "./projects.css"
import { getSupabaseBrowserClient } from "@/utils/supabase-client"
import ProjectCategoriesNav from "./project-categories-nav"
import { useTheme } from "next-themes"

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { theme } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const { toast } = useToast()

  const [projectsData, setProjectsData] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        // Fetch categories first
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("project_category")
          .select("*")
          .order("name", { ascending: true })

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

        // Fetch projects
        const { data: projects, error: projectsError } = await supabase
          .from("project")
          .select("*")
          .order("created_at", { ascending: false })

        if (projectsError) throw projectsError

        // For each project, fetch its technologies
        const enhancedProjects = await Promise.all(
          projects.map(async (project) => {
            // Fetch technologies
            const { data: technologies } = await supabase
              .from("project_technology")
              .select("technology")
              .eq("project_id", project.id)
              .order("display_order", { ascending: true })

            // Find the category name
            const category = categoriesData?.find((c) => c.id === project.category_id)

            return {
              ...project,
              categoryName: category?.name || project.category || "Uncategorized",
              technologies: technologies?.map((t) => t.technology) || [],
            }
          }),
        )

        setProjectsData(enhancedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? projectsData
      : projectsData.filter((project) => project.category_id?.toString() === activeCategory)

  if (loading) {
    return (
      <section id="projects" className="section-container">
        <div className="container mx-auto">
          <h2 className="section-title text-[#00e5a0]">My Projects</h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00e5a0]"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="section-container">
      <div className="container mx-auto">
        <h2 className="section-title text-[#00e5a0] mb-10">My Projects</h2>

        {/* Project navigation tabs */}
        <ProjectCategoriesNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-10"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants} transition={{ duration: 0.5 }}>
                <Card className="h-full flex flex-col overflow-hidden card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10"></div>
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      crossOrigin="anonymous"
                    />
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <div className="flex flex-col gap-1 mt-1">
                          {/* Display project type instead of category if available */}
                          {project.project_type ? (
                            <CardDescription className="text-primary font-medium">
                              {project.project_type}
                            </CardDescription>
                          ) : (
                            <CardDescription>{project.categoryName}</CardDescription>
                          )}
                          {project.date && (
                            <CardDescription className="text-xs text-foreground/50">{project.date}</CardDescription>
                          )}
                          {/* Display team type with icon */}
                          <div className="flex items-center gap-1 text-xs text-foreground/70 mt-1">
                            {project.team_type === "team" ? (
                              <>
                                <Users className="h-3 w-3" /> Team Project
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3" /> Solo Project
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-foreground/70 mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="bg-foreground/5">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap gap-2 justify-center sm:justify-between items-center w-full px-6 pb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group flex-1 sm:flex-none min-w-[80px]"
                      onClick={() => window.open(project.github || "https://github.com/nishchalreddy2005", "_blank")}
                    >
                      <Github className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> Code
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="group flex-1 sm:flex-none min-w-[80px] text-[#0077b5] border-[#0077b5]/20 bg-[#0077b5]/5 hover:bg-[#0077b5]/10 dark:text-white dark:border-white/20 dark:bg-[#0077b5]/10 dark:hover:bg-[#0077b5]/20"
                      onClick={() => {
                        if (project.linkedin && project.linkedin !== "#") {
                          window.open(project.linkedin, "_blank")
                        } else {
                          toast({
                            title: "LinkedIn Not Available",
                            description: "LinkedIn post is not available for this project.",
                            variant: "default",
                            duration: 3000,
                          })
                        }
                      }}
                    >
                      <Linkedin className="mr-2 h-4 w-4 text-[#0077b5]" /> LinkedIn
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1 sm:flex-none min-w-[80px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      onClick={() => {
                        if (project.demo && project.demo !== "#") {
                          window.open(project.demo, "_blank")
                        } else {
                          toast({
                            title: "Demo Not Available",
                            description: "This project is not deployed yet.",
                            variant: "default",
                            duration: 3000,
                          })
                        }
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10">
              <p className="text-foreground/70">No projects found in this category.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
