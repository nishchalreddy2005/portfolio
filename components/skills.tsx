"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Users, Zap, Database, Globe, Cpu, BarChart } from "lucide-react"
import Skills3DWrapper from "./skills-3d-wrapper"
import { technicalSkills, softSkills } from "./skills-data"

function SkillBar({ name, level, isAnimated = true }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm font-medium">{level}%</span>
      </div>
      <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isAnimated ? `${level}%` : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </div>
    </div>
  )
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState("technical")
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Group technical skills by category
  const groupedTechnicalSkills = technicalSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  // Group soft skills into two columns for better display
  const softSkillsColumn1 = softSkills.slice(0, Math.ceil(softSkills.length / 2))
  const softSkillsColumn2 = softSkills.slice(Math.ceil(softSkills.length / 2))

  // Get icon for skill category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Languages":
        return <Code className="h-4 w-4 mr-2 text-primary" />
      case "Frameworks":
        return <Zap className="h-4 w-4 mr-2 text-purple-500" />
      case "Databases":
        return <Database className="h-4 w-4 mr-2 text-green-500" />
      case "Web":
        return <Globe className="h-4 w-4 mr-2 text-rose-500" />
      case "Advanced":
        return <Cpu className="h-4 w-4 mr-2 text-amber-500" />
      case "Data":
        return <BarChart className="h-4 w-4 mr-2 text-cyan-500" />
      default:
        return <Code className="h-4 w-4 mr-2 text-primary" />
    }
  }

  // Mobile view for skills
  const renderMobileSkills = () => {
    // Return null to hide the skills section on mobile
    return null
  }

  return (
    <section id="skills" className="section-container bg-muted/30">
      <div className="container mx-auto">
        <h2 className="section-title">My Skills</h2>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Custom tabs that match the design in the image with reduced height */}
          <div className="w-full mb-10 flex rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("technical")}
              className={`flex items-center justify-center gap-2 py-2 px-4 w-1/2 transition-colors ${
                activeTab === "technical" ? "bg-black text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-700/70"
              }`}
            >
              <Code className="h-4 w-4" /> Technical Skills
            </button>
            <button
              onClick={() => setActiveTab("soft")}
              className={`flex items-center justify-center gap-2 py-2 px-4 w-1/2 transition-colors ${
                activeTab === "soft" ? "bg-black text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-700/70"
              }`}
            >
              <Users className="h-4 w-4" /> Soft Skills
            </button>
          </div>

          {/* Technical Skills Content */}
          {activeTab === "technical" && (
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="space-y-6">
                <Card className="card-hover overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-primary" />
                      Technical Proficiency
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      Proficient in various programming languages, frameworks, databases, and advanced technologies with
                      a focus on full-stack development and emerging technologies like blockchain and multi-agent
                      systems.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {technicalSkills.map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {Object.entries(groupedTechnicalSkills).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground/60 flex items-center">
                      {getCategoryIcon(category)}
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill.name}
                          className="bg-foreground/10 text-foreground hover:bg-foreground/20 dark:bg-foreground/5 dark:text-foreground dark:hover:bg-foreground/10"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="hidden md:block">
                <Skills3DWrapper activeTab={activeTab} />
              </motion.div>

              <motion.div variants={itemVariants} className="block md:hidden">
                {renderMobileSkills()}
              </motion.div>
            </motion.div>
          )}

          {/* Soft Skills Content */}
          {activeTab === "soft" && (
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="space-y-6">
                <Card className="card-hover overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-secondary" />
                      Interpersonal & Cognitive Skills
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      Strong teamwork and communication abilities combined with creative problem-solving, critical
                      thinking, and effective time management. Excellent adaptability and active listening skills for
                      successful collaboration in diverse environments.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="bg-secondary/10 text-secondary hover:bg-secondary/20 dark:bg-secondary/20 dark:text-secondary-foreground"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {softSkillsColumn1.map((skill) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        isAnimated={inView && activeTab === "soft"}
                      />
                    ))}
                  </div>
                  <div>
                    {softSkillsColumn2.map((skill) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        isAnimated={inView && activeTab === "soft"}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="hidden md:block">
                <Skills3DWrapper activeTab={activeTab} />
              </motion.div>

              <motion.div variants={itemVariants} className="block md:hidden">
                {renderMobileSkills()}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
