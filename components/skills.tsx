"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Skills3DWrapper from "./skills-3d-wrapper"
import MobileSkillsView from "./mobile-skills-view"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CustomIcon } from "./custom-icons"

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

export default function Skills({ data }) {
  const [activeTab, setActiveTab] = useState("technical")
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const isMobile = useMediaQuery("(max-width: 768px)")

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

  // Ensure we have valid data
  const skillsData = {
    technical: data?.technical || [],
    soft: data?.soft || [],
    customCategories: data?.customCategories || [],
  }

  // For debugging
  useEffect(() => {
    console.log("Skills component received data:", data)
    console.log("Custom categories in skills component:", skillsData.customCategories)
  }, [data])

  // Group technical skills by category
  const groupedTechnicalSkills = skillsData.technical.reduce((acc, skill) => {
    // Get the category name - either from the category field or from the custom category
    const categoryName = skill.category

    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(skill)
    return acc
  }, {})

  // Get a list of categories that actually have skills
  const categoriesWithSkills = Object.keys(groupedTechnicalSkills)

  // Filter customCategories to only include those that have skills
  const activeCustomCategories = skillsData.customCategories.filter((category) =>
    categoriesWithSkills.includes(category.name),
  )

  // Group soft skills into two columns for better display
  const softSkillsColumn1 = skillsData.soft.slice(0, Math.ceil(skillsData.soft.length / 2))
  const softSkillsColumn2 = skillsData.soft.slice(Math.ceil(skillsData.soft.length / 2))

  // Default category colors
  const DEFAULT_CATEGORY_COLORS = {
    Languages: "#3b82f6", // Blue
    Frameworks: "#8b5cf6", // Purple
    Databases: "#10b981", // Green
    Web: "#ef4444", // Red
    Advanced: "#f59e0b", // Orange
    Data: "#06b6d4", // Cyan
  }

  // Default category icons
  const DEFAULT_CATEGORY_ICONS = {
    Languages: "languages",
    Frameworks: "frameworks",
    Databases: "databases",
    Web: "web",
    Advanced: "advanced",
    Data: "data",
  }

  // Get icon for skill category
  const getCategoryIcon = (category) => {
    // Find the category in our categories list
    const categoryData = skillsData.customCategories.find((cat) => cat.name === category)

    console.log(`Getting icon for category: ${category}`, categoryData)

    // Map category name to icon name
    let iconName = "hash"

    if (category in DEFAULT_CATEGORY_ICONS) {
      iconName = DEFAULT_CATEGORY_ICONS[category]
    } else if (categoryData?.icon) {
      iconName = categoryData.icon
    }

    // Get color for the category
    const color = categoryData?.color || DEFAULT_CATEGORY_COLORS[category] || "#6366f1"

    return <CustomIcon name={iconName} className="mr-2" size={16} color={color} />
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
              <CustomIcon name="languages" size={16} /> Technical Skills
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
                      <CustomIcon name="frameworks" className="mr-2" size={20} />
                      Technical Proficiency
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      Proficient in various programming languages, frameworks, databases, and advanced technologies with
                      a focus on full-stack development and emerging technologies like blockchain and multi-agent
                      systems.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skillsData.technical.map((skill) => {
                        // Find the category for this skill
                        const category = skillsData.customCategories.find((cat) => cat.name === skill.category)
                        const categoryColor = category?.color || DEFAULT_CATEGORY_COLORS[skill.category] || "#6366f1"
                        const badgeStyle = { backgroundColor: `${categoryColor}20`, color: categoryColor }

                        return (
                          <Badge
                            key={skill.name}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground"
                            style={badgeStyle}
                          >
                            {skill.name}
                          </Badge>
                        )
                      })}
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
                      {skills.map((skill) => {
                        // Find the category for this skill
                        const categoryData = skillsData.customCategories.find((cat) => cat.name === skill.category)
                        const categoryColor =
                          categoryData?.color || DEFAULT_CATEGORY_COLORS[skill.category] || "#6366f1"
                        const badgeStyle = { backgroundColor: `${categoryColor}20`, color: categoryColor }

                        return (
                          <Badge
                            key={skill.name}
                            className="bg-foreground/10 text-foreground hover:bg-foreground/20 dark:bg-foreground/5 dark:text-foreground dark:hover:bg-foreground/10"
                            style={badgeStyle}
                          >
                            {skill.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="hidden md:block">
                {/* Pass the filtered custom categories to the 3D wrapper */}
                <Skills3DWrapper
                  activeTab={activeTab}
                  technicalSkills={skillsData.technical}
                  softSkills={skillsData.soft}
                  customCategories={activeCustomCategories}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="block md:hidden">
                <MobileSkillsView
                  activeTab={activeTab}
                  skills={activeTab === "technical" ? skillsData.technical : skillsData.soft}
                  customCategories={activeCustomCategories}
                />
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
                      {skillsData.soft.map((skill) => (
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
                <Skills3DWrapper
                  activeTab={activeTab}
                  technicalSkills={skillsData.technical}
                  softSkills={skillsData.soft}
                  customCategories={activeCustomCategories}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="block md:hidden">
                <MobileSkillsView
                  activeTab={activeTab}
                  skills={activeTab === "technical" ? skillsData.technical : skillsData.soft}
                  customCategories={activeCustomCategories}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
