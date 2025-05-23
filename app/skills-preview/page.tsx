import { technicalSkills, softSkills } from "@/components/skills-data"
import Skills from "@/components/skills"

export default function SkillsPreviewPage() {
  // Create a mock data object that matches the structure expected by the Skills component
  const mockData = {
    technical: technicalSkills,
    soft: softSkills,
  }

  return (
    <div className="min-h-screen bg-background">
      <Skills data={mockData} />
    </div>
  )
}
