"use client"

import { CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Code, Layers, Linkedin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import "./projects.css"

const projectsData = [
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
  {
    id: 3,
    title: "Electricity Bill Generation System",
    category: "Enterprise Programming",
    description:
      "An enterprise-grade billing system to automate electricity bill generation using EJB, MySQL, JSP, and Code Ready Studio.",
    features: [
      "Implemented customer management, bill calculation, and payment tracking functionalities.",
      "Optimized system performance for handling large-scale user data and transactions.",
    ],
    technologies: ["Java EE", "EJB", "MySQL", "JSP", "Code Ready Studio"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7rnvolAJgSuRMaX8kMklnDAicPXGR.png",
    github: "https://github.com/nishchalreddy2005/Electrictily-billing-system",
    demo: "#",
    linkedin: "#",
  },
  {
    id: 4,
    title: "Student Feedback and Management System",
    category: "Java Full Stack Development",
    description: "A feedback management platform for educational institutions using Spring Boot, MySQL, and React.",
    features: [
      "Designed an intuitive user interface for students to submit feedback and administrators to analyze reports.",
      "Integrated sentiment analysis and data visualization for better decision-making.",
    ],
    technologies: ["Java", "Spring Boot", "MySQL", "React", "Chart.js"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XZVuD6KPOw7XDYULweHBOoLrDFNpPD.png",
    github: "https://github.com/nishchalreddy2005/JFSD_S34_15",
    demo: "#",
    linkedin:
      "https://www.linkedin.com/posts/gvrnishchalreddy_activity-7247458297803350016-AhTl?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEWwBNMBxDIjzIsQFygYjlLAdnx1TxyiVV4",
  },
]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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

  // Extract categories from project data
  const categories = ["all", "python", "mern", "enterprise", "java"]

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? projectsData
      : projectsData.filter((project) => project.category.toLowerCase().includes(activeCategory))

  return (
    <section id="projects" className="section-container bg-background">
      <div className="container mx-auto">
        <h2 className="section-title">My Projects</h2>

        {/* Project navigation tabs */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="project-tabs-container">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`project-tab ${activeCategory === category ? "active" : ""}`}
              >
                {category === "all" ? (
                  <>
                    <Layers className="h-4 w-4" /> All Projects
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4" /> {category.charAt(0).toUpperCase() + category.slice(1)}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {filteredProjects.map((project) => (
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
                      <CardDescription className="mt-1">{project.category}</CardDescription>
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
          ))}
        </motion.div>
      </div>
    </section>
  )
}
