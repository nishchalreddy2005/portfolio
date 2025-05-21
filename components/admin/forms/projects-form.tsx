"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample project data
const initialProjects = [
  {
    id: 1,
    title: "Banking and Finance Management System",
    category: "Python Full Stack Web Development",
    description:
      "A secure and scalable web application for managing banking and financial transactions using Django and PostgreSQL.",
    features: [
      "Implemented authentication, account management, and transaction processing features.",
      "Ensured data integrity and security through robust database design and encryption techniques.",
    ],
    technologies: ["Python", "Django", "PostgreSQL", "HTML/CSS", "JavaScript"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HANvsAaOGSzRpC09BJlzp3JeJPAptW.png",
    github: "https://github.com/nishchalreddy2005/banking-management-system",
    demo: "#",
    linkedin:
      "https://www.linkedin.com/posts/pidikiti-sathwik_skilldevelopment-kluniversity-engineering-activity-7103402089770307584-AoPL?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEWwBNMBxDIjzIsQFygYjlLAdnx1TxyiVV4",
  },
  {
    id: 2,
    title: "Student Counseling and Management System",
    category: "MERN Stack Web Development",
    description:
      "A web-based platform to facilitate student counseling and academic tracking using MongoDB, Node.js, React, and Express.",
    features: [
      "Implemented role-based access for students and counselors to schedule sessions and manage records.",
      "Integrated real-time chat and notifications for seamless communication.",
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "Socket.io"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UR0Uo8ELbpGO4ApDPIsLnynkJT2RmG.png",
    github: "https://github.com/nishchalreddy2005/student-counselling-management-system",
    demo: "#",
    linkedin:
      "https://www.linkedin.com/posts/gvrnishchalreddy_y22mswds14-sdp-mswd-activity-7159252043612790784-roPp/?rcm=ACoAAEWwBNMBxDIjzIsQFygYjlLAdnx1TxyiVV4",
  },
]

export default function ProjectsForm() {
  const [projects, setProjects] = useState(initialProjects)
  const [isLoading, setIsLoading] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [expandedProject, setExpandedProject] = useState(null)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to save the data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Changes saved",
        description: "Projects updated successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "Category",
      description: "Project description",
      features: ["Feature 1"],
      technologies: ["Technology 1"],
      image: "",
      github: "",
      demo: "",
      linkedin: "",
    }

    setProjects([...projects, newProject])
    setEditingProject(newProject.id)
    setExpandedProject(newProject.id)
  }

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id))
    if (editingProject === id) setEditingProject(null)
    if (expandedProject === id) setExpandedProject(null)

    toast({
      title: "Project deleted",
      description: "The project has been removed",
      variant: "default",
    })
  }

  const toggleExpand = (id) => {
    setExpandedProject(expandedProject === id ? null : id)
  }

  const handleEditProject = (id) => {
    setEditingProject(id)
    setExpandedProject(id)
  }

  const handleUpdateProject = (id, field, value) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value || "" } : project)))
  }

  const handleUpdateFeature = (projectId, index, value) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const features = [...project.features]
          features[index] = value || "" // Ensure we never set undefined or null
          return { ...project, features }
        }
        return project
      }),
    )
  }

  const handleAddFeature = (projectId) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, features: [...project.features, "New feature"] }
        }
        return project
      }),
    )
  }

  const handleDeleteFeature = (projectId, index) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const features = [...project.features]
          features.splice(index, 1)
          return { ...project, features }
        }
        return project
      }),
    )
  }

  const handleUpdateTechnology = (projectId, index, value) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const technologies = [...project.technologies]
          technologies[index] = value || "" // Ensure we never set undefined or null
          return { ...project, technologies }
        }
        return project
      }),
    )
  }

  const handleAddTechnology = (projectId) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, technologies: [...project.technologies, "New technology"] }
        }
        return project
      }),
    )
  }

  const handleDeleteTechnology = (projectId, index) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const technologies = [...project.technologies]
          technologies.splice(index, 1)
          return { ...project, technologies }
        }
        return project
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  {editingProject === project.id ? (
                    <Input
                      value={project.title}
                      onChange={(e) => handleUpdateProject(project.id, "title", e.target.value)}
                      className="font-bold text-xl mb-1"
                    />
                  ) : (
                    <CardTitle>{project.title}</CardTitle>
                  )}

                  {editingProject === project.id ? (
                    <Input
                      value={project.category}
                      onChange={(e) => handleUpdateProject(project.id, "category", e.target.value)}
                      className="text-sm text-muted-foreground"
                    />
                  ) : (
                    <CardDescription>{project.category}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingProject !== project.id && (
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => toggleExpand(project.id)}>
                    {expandedProject === project.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedProject === project.id && (
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    {editingProject === project.id ? (
                      <Textarea
                        value={project.description}
                        onChange={(e) => handleUpdateProject(project.id, "description", e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Features</label>
                      {editingProject === project.id && (
                        <Button variant="outline" size="sm" onClick={() => handleAddFeature(project.id)}>
                          <Plus className="h-3 w-3 mr-1" /> Add Feature
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          {editingProject === project.id ? (
                            <>
                              <Input
                                value={feature}
                                onChange={(e) => handleUpdateFeature(project.id, index, e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteFeature(project.id, index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <p className="text-sm">• {feature}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Technologies</label>
                      {editingProject === project.id && (
                        <Button variant="outline" size="sm" onClick={() => handleAddTechnology(project.id)}>
                          <Plus className="h-3 w-3 mr-1" /> Add Technology
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <div key={index}>
                          {editingProject === project.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={tech}
                                onChange={(e) => handleUpdateTechnology(project.id, index, e.target.value)}
                                className="w-32"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteTechnology(project.id, index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline">{tech}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {editingProject === project.id && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input
                          value={project.image}
                          onChange={(e) => handleUpdateProject(project.id, "image", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">GitHub URL</label>
                          <Input
                            value={project.github}
                            onChange={(e) => handleUpdateProject(project.id, "github", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Demo URL</label>
                          <Input
                            value={project.demo}
                            onChange={(e) => handleUpdateProject(project.id, "demo", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">LinkedIn Post URL</label>
                          <Input
                            value={project.linkedin}
                            onChange={(e) => handleUpdateProject(project.id, "linkedin", e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            )}

            {editingProject === project.id && expandedProject === project.id && (
              <CardFooter className="flex justify-end pt-0 pb-4 px-6">
                <Button onClick={() => setEditingProject(null)}>Done Editing</Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving All Projects..." : "Save All Projects"}
      </Button>
    </div>
  )
}
