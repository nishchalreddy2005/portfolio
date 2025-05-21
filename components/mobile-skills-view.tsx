"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Default category colors with more vibrant options
const DEFAULT_CATEGORY_COLORS = {
  Languages: "#00aaff", // Bright blue
  Frameworks: "#aa00ff", // Bright purple
  Databases: "#00ff88", // Bright green
  Web: "#ff3366", // Bright red
  Advanced: "#ff9500", // Bright orange
  Data: "#00ddff", // Bright cyan
}

export default function MobileSkillsView({ activeTab, skills = [], customCategories = [] }) {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [showLegend, setShowLegend] = useState(false)

  // Reset selected skill when tab changes
  useEffect(() => {
    setSelectedSkill(null)
  }, [activeTab])

  // Group technical skills by category
  const groupedSkills =
    activeTab === "technical"
      ? skills.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = []
          }
          acc[skill.category].push(skill)
          return acc
        }, {})
      : null

  // Colors for soft skills
  const softSkillColors = ["#ff3366", "#ff9500", "#aa00ff", "#00aaff", "#00ff88", "#ffcc00"]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <div className="h-[500px] w-full rounded-xl bg-gradient-to-br from-gray-900 to-black p-6 overflow-y-auto relative">
      {/* Header with title and legend toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          {activeTab === "technical" ? (
            <span className="text-[#00ffaa]">Technical Skills Network</span>
          ) : (
            <span className="text-[#aa00ff]">Soft Skills Visualization</span>
          )}
        </h3>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`px-2 py-1 rounded text-xs ${
            activeTab === "technical" ? "bg-[#00ffaa]/20 text-[#00ffaa]" : "bg-[#aa00ff]/20 text-[#aa00ff]"
          }`}
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-4 p-3 rounded-lg ${
            activeTab === "technical"
              ? "bg-[#00ffaa]/10 border border-[#00ffaa]/30"
              : "bg-[#aa00ff]/10 border border-[#aa00ff]/30"
          }`}
        >
          <div className="flex flex-wrap gap-3">
            {activeTab === "technical"
              ? customCategories.length > 0
                ? customCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color || DEFAULT_CATEGORY_COLORS[cat.name] || "#00aaff" }}
                      ></div>
                      <span className="text-xs text-white">{cat.name}</span>
                    </div>
                  ))
                : Object.entries(DEFAULT_CATEGORY_COLORS).map(([name, color]) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      <span className="text-xs text-white">{name}</span>
                    </div>
                  ))
              : softSkillColors.map((color, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-xs text-white">Skill Group {i + 1}</span>
                  </div>
                ))}
          </div>
        </motion.div>
      )}

      {/* Technical Skills View */}
      {activeTab === "technical" && (
        <div className="space-y-6">
          {/* Selected skill detail */}
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 p-4 rounded-lg border border-[#00ffaa]/30 mb-4"
            >
              <h4 className="text-lg font-bold text-[#00ffaa] mb-1">{selectedSkill.name}</h4>
              <p className="text-sm text-gray-300 mb-2">Category: {selectedSkill.category}</p>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#00ffaa] rounded-full" style={{ width: `${selectedSkill.level}%` }}></div>
              </div>
              <p className="text-xs text-right text-gray-400 mt-1">Proficiency: {selectedSkill.level}%</p>
            </motion.div>
          )}

          {/* Network visualization hint */}
          <div className="text-center mb-4 text-xs text-gray-400">
            <p>Tap on skills to view details</p>
            <p>Skills are grouped by category</p>
          </div>

          {/* Categories and skills */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {Object.entries(groupedSkills || {}).map(([category, categorySkills]) => {
              // Find custom category
              const customCategory = customCategories.find((cat) => cat.name === category)
              const categoryColor = customCategory?.color || DEFAULT_CATEGORY_COLORS[category] || "#00aaff"

              return (
                <motion.div key={category} className="mb-6" variants={itemVariants}>
                  <h4
                    className="text-sm font-medium mb-2 px-2 py-1 rounded flex items-center"
                    style={{
                      color: categoryColor,
                      backgroundColor: `${categoryColor}20`,
                      borderLeft: `3px solid ${categoryColor}`,
                    }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: categoryColor }}
                    ></span>
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2 pl-2">
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.name}
                        variants={itemVariants}
                        whileTap={{ scale: 0.95 }}
                        className={`cursor-pointer transition-all px-3 py-1.5 rounded-full text-sm ${
                          selectedSkill?.name === skill.name
                            ? "bg-[#00ffaa] text-black font-medium"
                            : `bg-[${categoryColor}20] text-white`
                        }`}
                        style={{
                          backgroundColor: selectedSkill?.name === skill.name ? categoryColor : `${categoryColor}20`,
                          color: selectedSkill?.name === skill.name ? "black" : "white",
                          boxShadow: selectedSkill?.name === skill.name ? `0 0 10px ${categoryColor}` : "none",
                        }}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        {skill.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}

      {/* Soft Skills View */}
      {activeTab === "soft" && (
        <div className="space-y-6">
          {/* Selected skill detail */}
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 p-4 rounded-lg border border-[#aa00ff]/30 mb-4"
            >
              <h4 className="text-lg font-bold text-[#aa00ff] mb-1">{selectedSkill.name}</h4>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#aa00ff] rounded-full" style={{ width: `${selectedSkill.level}%` }}></div>
              </div>
              <p className="text-xs text-right text-gray-400 mt-1">Proficiency: {selectedSkill.level}%</p>
            </motion.div>
          )}

          {/* Network visualization hint */}
          <div className="text-center mb-4 text-xs text-gray-400">
            <p>Tap on skills to view details</p>
            <p>Skills are arranged by proficiency level</p>
          </div>

          {/* Soft skills in a hexagonal-inspired grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {skills.map((skill, index) => {
              const color = softSkillColors[index % softSkillColors.length]

              return (
                <motion.div
                  key={skill.name}
                  variants={itemVariants}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden ${
                    selectedSkill?.name === skill.name ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: `${color}20`,
                    borderLeft: `3px solid ${color}`,
                    boxShadow: selectedSkill?.name === skill.name ? `0 0 15px ${color}` : "none",
                    ringColor: color,
                  }}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {/* Skill level indicator as background fill */}
                  <div
                    className="absolute bottom-0 left-0 bg-opacity-20 z-0"
                    style={{
                      width: `${skill.level}%`,
                      height: "100%",
                      backgroundColor: color,
                      opacity: 0.2,
                    }}
                  ></div>

                  <div className="relative z-10">
                    <h5
                      className="font-medium mb-1 flex items-center"
                      style={{ color: selectedSkill?.name === skill.name ? color : "white" }}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: color }}
                      ></span>
                      {skill.name}
                    </h5>
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${skill.level}%`, backgroundColor: color }}
                      ></div>
                    </div>
                    <p className="text-right text-xs mt-1 text-gray-400">{skill.level}%</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}

      {/* Instructions */}
      <div
        className={`absolute bottom-4 right-4 text-xs p-2 rounded-lg ${
          activeTab === "technical" ? "bg-[#00ffaa]/10 text-[#00ffaa]" : "bg-[#aa00ff]/10 text-[#aa00ff]"
        }`}
      >
        Interactive Skills Map
      </div>
    </div>
  )
}
