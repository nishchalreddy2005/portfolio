"use client"

import { motion } from "framer-motion"
import { technicalSkills, softSkills } from "./skills-data"

export default function MobileSkillsView({ activeTab }) {
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

  const skills = activeTab === "technical" ? technicalSkills : softSkills

  return (
    <div className="h-[400px] w-full rounded-xl bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col items-center justify-center overflow-y-auto">
      <h3 className="text-2xl font-bold text-white mb-8">
        {activeTab === "technical" ? "Technical Skills" : "Soft Skills"}
      </h3>

      <motion.div
        className="flex flex-wrap justify-center gap-4 max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skills.map((skill) => {
          // Determine if skill name is short enough for circular display
          const isShortName = skill.name.length <= 8

          return (
            <motion.span
              key={skill.name}
              variants={itemVariants}
              className={`
                inline-flex items-center justify-center 
                ${isShortName ? "w-16 h-16 rounded-full" : "px-4 py-2 rounded-full"}
                bg-black/40 backdrop-blur-sm text-white text-sm font-medium 
                border border-white/10 hover:bg-black/60 transition-colors
              `}
            >
              {skill.name}
            </motion.span>
          )
        })}
      </motion.div>
    </div>
  )
}
