"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Users, Zap, Database, Globe, Cpu, BarChart } from "lucide-react"

// Hardcoded skills data for preview
const technicalSkills = [
  { name: "C", level: 85, category: "Languages" },
  { name: "Java", level: 90, category: "Languages" },
  { name: "JavaScript", level: 85, category: "Languages" },
  { name: "Python", level: 88, category: "Languages" },
  { name: "ReactJS", level: 80, category: "Frameworks" },
  { name: "ExpressJS", level: 75, category: "Frameworks" },
  { name: "Node.js", level: 75, category: "Frameworks" },
  { name: "Django", level: 82, category: "Frameworks" },
  { name: "SQL", level: 80, category: "Databases" },
  { name: "MongoDB", level: 78, category: "Databases" },
  { name: "HTML", level: 90, category: "Web" },
  { name: "CSS", level: 85, category: "Web" },
  { name: "Blockchain", level: 75, category: "Advanced" },
  { name: "Multiagents", level: 72, category: "Advanced" },
  { name: "Data Science", level: 80, category: "Data" },
  { name: "Visualization", level: 78, category: "Data" },
]

const softSkills = [
  { name: "Teamwork", level: 90 },
  { name: "Leadership", level: 85 },
  { name: "Adaptability", level: 85 },
  { name: "Creativity", level: 82 },
  { name: "Active Listening", level: 85 },
  { name: "Critical Thinking", level: 87 },
  { name: "Communication", level: 88 },
  { name: "Time Management", level: 84 },
  { name: "Problem Solving", level: 90 },
  { name: "Multitasking", level: 83 },
]

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

export default function SkillsPreview() {
  const [activeTab, setActiveTab] = useState("technical")

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

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-heading">My Skills</h2>

        {/* Custom tabs */}
        <div className="w-full mb-10 flex rounded-lg overflow-hidden max-w-5xl mx-auto">
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

        <div className="max-w-5xl mx-auto">
          {/* Technical Skills Content */}
          {activeTab === "technical" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="overflow-hidden">
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
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-white mb-6">Technical Skills Visualization</h3>
                <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                  {technicalSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium border border-white/10"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Soft Skills Content */}
          {activeTab === "soft" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="overflow-hidden">
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
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} isAnimated={true} />
                    ))}
                  </div>
                  <div>
                    {softSkillsColumn2.map((skill) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} isAnimated={true} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-white mb-6">Soft Skills Visualization</h3>
                <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                  {softSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium border border-white/10"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
