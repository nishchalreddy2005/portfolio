"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample skills data
const initialTechnicalSkills = [
  { name: "JavaScript", level: 85, category: "Languages" },
  { name: "Python", level: 88, category: "Languages" },
  { name: "ReactJS", level: 80, category: "Frameworks" },
  { name: "MongoDB", level: 78, category: "Databases" },
]

const initialSoftSkills = [
  { name: "Teamwork", level: 90 },
  { name: "Communication", level: 88 },
  { name: "Problem Solving", level: 90 },
]

export default function SkillsForm() {
  const [technicalSkills, setTechnicalSkills] = useState(initialTechnicalSkills)
  const [softSkills, setSoftSkills] = useState(initialSoftSkills)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to save the data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Changes saved",
        description: "Skills updated successfully",
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

  const handleAddTechnicalSkill = () => {
    setTechnicalSkills([...technicalSkills, { name: "New Skill", level: 75, category: "Languages" }])
  }

  const handleAddSoftSkill = () => {
    setSoftSkills([...softSkills, { name: "New Soft Skill", level: 75 }])
  }

  const handleDeleteTechnicalSkill = (index) => {
    const newSkills = [...technicalSkills]
    newSkills.splice(index, 1)
    setTechnicalSkills(newSkills)
  }

  const handleDeleteSoftSkill = (index) => {
    const newSkills = [...softSkills]
    newSkills.splice(index, 1)
    setSoftSkills(newSkills)
  }

  const handleUpdateTechnicalSkill = (index, field, value) => {
    const newSkills = [...technicalSkills]
    // If the field is 'level' and the value is a number input, ensure it's a valid number
    if (field === "level") {
      const numValue = Number.parseInt(value)
      newSkills[index] = { ...newSkills[index], [field]: isNaN(numValue) ? 0 : numValue }
    } else {
      newSkills[index] = { ...newSkills[index], [field]: value }
    }
    setTechnicalSkills(newSkills)
  }

  const handleUpdateSoftSkill = (index, field, value) => {
    const newSkills = [...softSkills]
    // If the field is 'level' and the value is a number input, ensure it's a valid number
    if (field === "level") {
      const numValue = Number.parseInt(value)
      newSkills[index] = { ...newSkills[index], [field]: isNaN(numValue) ? 0 : numValue }
    } else {
      newSkills[index] = { ...newSkills[index], [field]: value }
    }
    setSoftSkills(newSkills)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
          <CardDescription>Manage your technical skills and proficiency levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicalSkills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 border p-3 rounded-md">
                <div className="flex-1">
                  <Input
                    value={skill.name}
                    onChange={(e) => handleUpdateTechnicalSkill(index, "name", e.target.value)}
                    placeholder="Skill name"
                  />
                </div>
                <div className="w-32">
                  <Select
                    value={skill.category}
                    onValueChange={(value) => handleUpdateTechnicalSkill(index, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Languages">Languages</SelectItem>
                      <SelectItem value="Frameworks">Frameworks</SelectItem>
                      <SelectItem value="Databases">Databases</SelectItem>
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Data">Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    value={skill.level.toString()}
                    onChange={(e) => handleUpdateTechnicalSkill(index, "level", e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteTechnicalSkill(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddTechnicalSkill} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Technical Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soft Skills</CardTitle>
          <CardDescription>Manage your soft skills and proficiency levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {softSkills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 border p-3 rounded-md">
                <div className="flex-1">
                  <Input
                    value={skill.name}
                    onChange={(e) => handleUpdateSoftSkill(index, "name", e.target.value)}
                    placeholder="Skill name"
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    value={skill.level.toString()}
                    onChange={(e) => handleUpdateSoftSkill(index, "level", e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteSoftSkill(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddSoftSkill} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Soft Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Skills"}
      </Button>
    </div>
  )
}
