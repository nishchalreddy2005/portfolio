"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, AlertTriangle, Settings, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSkills, fetchCustomCategories } from "@/utils/supabase-data-service"
import { isSupabaseAvailable } from "@/utils/data-service"
import { technicalSkills as frontendTechnicalSkills, softSkills as frontendSoftSkills } from "@/components/skills-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomCategoriesForm from "./custom-categories-form"
import type { CustomCategory } from "@/utils/supabase-data-service"

interface TechnicalSkill {
  id: string
  name: string
  level: number
  category: string
  custom_category_id?: string
  customCategory?: CustomCategory
}

interface SoftSkill {
  id: string
  name: string
  level: number
}

interface SkillsData {
  technical: TechnicalSkill[]
  soft: SoftSkill[]
  customCategories?: CustomCategory[]
}

interface SkillsFormProps {
  initialData: SkillsData
  onSave: (data: SkillsData) => void
}

// Predefined categories
const PREDEFINED_CATEGORIES = ["Languages", "Frameworks", "Databases", "Web", "Advanced", "Data"]

export default function SkillsForm({ initialData, onSave }: SkillsFormProps) {
  const [activeTab, setActiveTab] = useState("technical")
  const [technicalSkills, setTechnicalSkills] = useState<TechnicalSkill[]>([])
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([])
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [supabaseAvailable, setSupabaseAvailable] = useState(true)
  const { toast } = useToast()

  // Use a ref to track if a save operation is in progress to prevent duplicates
  const isSavingRef = useRef(false)

  // Check if Supabase is available
  useEffect(() => {
    const checkSupabase = async () => {
      const available = await isSupabaseAvailable()
      setSupabaseAvailable(available)
    }
    checkSupabase()
  }, [])

  // Initialize skills from initialData or frontend data
  useEffect(() => {
    // Initialize technical skills
    if (initialData.technical && initialData.technical.length > 0) {
      // Deduplicate skills by name
      const uniqueSkills = deduplicateSkills(initialData.technical)
      setTechnicalSkills(uniqueSkills)
    } else {
      setTechnicalSkills(
        frontendTechnicalSkills.map((skill, index) => ({
          id: (index + 1).toString(),
          name: skill.name,
          level: skill.level,
          category: skill.category,
        })),
      )
    }

    // Initialize soft skills
    if (initialData.soft && initialData.soft.length > 0) {
      // Deduplicate skills by name
      const uniqueSkills = deduplicateSkills(initialData.soft)
      setSoftSkills(uniqueSkills)
    } else {
      setSoftSkills(
        frontendSoftSkills.map((skill, index) => ({
          id: (index + 1).toString(),
          name: skill.name,
          level: skill.level,
        })),
      )
    }

    // Initialize custom categories
    if (initialData.customCategories && initialData.customCategories.length > 0) {
      // Deduplicate categories by name
      const uniqueCategories = deduplicateCategories(initialData.customCategories)
      setCustomCategories(uniqueCategories)
    }
  }, [initialData])

  // Helper function to deduplicate skills by name
  const deduplicateSkills = <T extends { name: string; id: string }>(skills: T[]): T[] => {
    const uniqueSkills: T[] = []
    const seenNames = new Set<string>()

    for (const skill of skills) {
      const normalizedName = skill.name.toLowerCase().trim()
      if (!seenNames.has(normalizedName)) {
        seenNames.add(normalizedName)
        uniqueSkills.push(skill)
      } else {
        console.log(`Duplicate skill found and removed: ${skill.name}`)
      }
    }

    return uniqueSkills
  }

  // Helper function to deduplicate categories by name
  const deduplicateCategories = (categories: CustomCategory[]): CustomCategory[] => {
    const uniqueCategories: CustomCategory[] = []
    const seenNames = new Set<string>()

    for (const category of categories) {
      const normalizedName = category.name.toLowerCase().trim()
      if (!seenNames.has(normalizedName)) {
        seenNames.add(normalizedName)
        uniqueCategories.push(category)
      } else {
        console.log(`Duplicate category found and removed: ${category.name}`)
      }
    }

    return uniqueCategories
  }

  // Function to refresh custom categories from the database
  const refreshCustomCategories = async () => {
    if (!supabaseAvailable) {
      toast({
        title: "Error",
        description: "Cannot refresh categories: Supabase connection unavailable",
        variant: "destructive",
      })
      return
    }

    setIsRefreshing(true)
    try {
      const categories = await fetchCustomCategories()
      // Deduplicate categories
      const uniqueCategories = deduplicateCategories(categories)
      setCustomCategories(uniqueCategories)

      // Update any skills that use these categories
      setTechnicalSkills((prevSkills) =>
        prevSkills.map((skill) => {
          if (skill.custom_category_id) {
            const category = uniqueCategories.find((cat) => cat.id === skill.custom_category_id)
            if (category) {
              return {
                ...skill,
                category: category.name,
                customCategory: category,
              }
            }
          }
          return skill
        }),
      )

      toast({
        title: "Success",
        description: `Refreshed ${uniqueCategories.length} custom categories from database`,
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh categories",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSave = async () => {
    // Prevent duplicate save operations
    if (isSavingRef.current) {
      console.log("Save operation already in progress, ignoring duplicate request")
      return
    }

    isSavingRef.current = true
    setIsLoading(true)

    try {
      // Validate data
      const invalidTechnical = technicalSkills.some((skill) => !skill.name.trim())
      const invalidSoft = softSkills.some((skill) => !skill.name.trim())

      if (invalidTechnical || invalidSoft) {
        throw new Error("All skills must have a name")
      }

      // Deduplicate skills before saving
      const uniqueTechnicalSkills = deduplicateSkills(technicalSkills)
      const uniqueSoftSkills = deduplicateSkills(softSkills)
      const uniqueCustomCategories = deduplicateCategories(customCategories)

      // Update state with deduplicated skills
      setTechnicalSkills(uniqueTechnicalSkills)
      setSoftSkills(uniqueSoftSkills)
      setCustomCategories(uniqueCustomCategories)

      // Make sure we're including the custom categories in the data we save
      const skillsData: SkillsData = {
        technical: uniqueTechnicalSkills,
        soft: uniqueSoftSkills,
        customCategories: uniqueCustomCategories,
      }

      console.log("Saving skills data:", {
        technicalCount: uniqueTechnicalSkills.length,
        softCount: uniqueSoftSkills.length,
        categoriesCount: uniqueCustomCategories.length,
      })

      // Save to Supabase if available
      if (supabaseAvailable) {
        await updateSkills(skillsData)
      }

      // Call the parent's onSave callback with all data including custom categories
      onSave(skillsData)

      toast({
        title: "Changes saved",
        description: "Skills updated successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
        duration: 2000, // 2 seconds
      })

      // Instead of reloading the page, just refresh the data
      if (supabaseAvailable) {
        await refreshCustomCategories()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Reset the saving flag after a short delay to prevent rapid consecutive saves
      setTimeout(() => {
        isSavingRef.current = false
      }, 1000)
    }
  }

  const handleAddTechnicalSkill = () => {
    // Check for empty skills first
    const hasEmptySkill = technicalSkills.some((skill) => !skill.name.trim())
    if (hasEmptySkill) {
      toast({
        title: "Warning",
        description: "Please fill in all existing skills before adding a new one",
        variant: "destructive",
      })
      return
    }

    const newSkill = {
      id: `new-${Date.now().toString()}`,
      name: "",
      level: 75,
      category: "Languages",
    }
    setTechnicalSkills([...technicalSkills, newSkill])
  }

  const handleAddSoftSkill = () => {
    // Check for empty skills first
    const hasEmptySkill = softSkills.some((skill) => !skill.name.trim())
    if (hasEmptySkill) {
      toast({
        title: "Warning",
        description: "Please fill in all existing skills before adding a new one",
        variant: "destructive",
      })
      return
    }

    const newSkill = {
      id: `new-${Date.now().toString()}`,
      name: "",
      level: 75,
    }
    setSoftSkills([...softSkills, newSkill])
  }

  const handleDeleteTechnicalSkill = (id: string) => {
    console.log("Deleting technical skill with ID:", id)
    setTechnicalSkills(technicalSkills.filter((skill) => skill.id !== id))
  }

  const handleDeleteSoftSkill = (id: string) => {
    console.log("Deleting soft skill with ID:", id)
    setSoftSkills(softSkills.filter((skill) => skill.id !== id))
  }

  const handleUpdateTechnicalSkill = (id: string, field: keyof TechnicalSkill, value: string | number) => {
    setTechnicalSkills(
      technicalSkills.map((skill) => {
        if (skill.id === id) {
          if (field === "level") {
            const numValue = typeof value === "string" ? Number.parseInt(value) : value
            return { ...skill, [field]: isNaN(numValue) ? 0 : numValue }
          }

          // If changing category, handle custom category ID
          if (field === "category") {
            const isCustomCategory = !PREDEFINED_CATEGORIES.includes(value as string)

            if (isCustomCategory) {
              // Find the custom category by name
              const category = customCategories.find((cat) => cat.name === value)
              return {
                ...skill,
                category: value as string,
                custom_category_id: category?.id,
                customCategory: category,
              }
            } else {
              // Reset custom category if selecting a predefined category
              return {
                ...skill,
                category: value as string,
                custom_category_id: undefined,
                customCategory: undefined,
              }
            }
          }

          // If changing name, check for duplicates
          if (field === "name") {
            const normalizedValue = (value as string).toLowerCase().trim()
            const isDuplicate = technicalSkills.some(
              (s) => s.id !== id && s.name.toLowerCase().trim() === normalizedValue,
            )

            if (isDuplicate) {
              toast({
                title: "Warning",
                description: `A skill with the name "${value}" already exists`,
                variant: "destructive",
              })
              // Return the skill unchanged
              return skill
            }
          }

          return { ...skill, [field]: value }
        }
        return skill
      }),
    )
  }

  const handleUpdateSoftSkill = (id: string, field: keyof SoftSkill, value: string | number) => {
    setSoftSkills(
      softSkills.map((skill) => {
        if (skill.id === id) {
          if (field === "level") {
            const numValue = typeof value === "string" ? Number.parseInt(value) : value
            return { ...skill, [field]: isNaN(numValue) ? 0 : numValue }
          }

          // If changing name, check for duplicates
          if (field === "name") {
            const normalizedValue = (value as string).toLowerCase().trim()
            const isDuplicate = softSkills.some((s) => s.id !== id && s.name.toLowerCase().trim() === normalizedValue)

            if (isDuplicate) {
              toast({
                title: "Warning",
                description: `A skill with the name "${value}" already exists`,
                variant: "destructive",
              })
              // Return the skill unchanged
              return skill
            }
          }

          return { ...skill, [field]: value }
        }
        return skill
      }),
    )
  }

  // Function to sync with frontend data
  const syncWithFrontend = () => {
    setTechnicalSkills(
      frontendTechnicalSkills.map((skill, index) => ({
        id: (index + 1).toString(),
        name: skill.name,
        level: skill.level,
        category: skill.category,
      })),
    )
    setSoftSkills(
      frontendSoftSkills.map((skill, index) => ({
        id: (index + 1).toString(),
        name: skill.name,
        level: skill.level,
      })),
    )

    toast({
      title: "Skills synchronized",
      description: "Skills have been synchronized with frontend data",
      variant: "default",
      className: "bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800",
      duration: 2000,
    })
  }

  // Handle custom categories update
  const handleCustomCategoriesUpdate = (updatedCategories: CustomCategory[]) => {
    // Deduplicate categories
    const uniqueCategories = deduplicateCategories(updatedCategories)
    setCustomCategories(uniqueCategories)

    // Update any skills that use these categories
    setTechnicalSkills(
      technicalSkills.map((skill) => {
        if (skill.custom_category_id) {
          const category = uniqueCategories.find((cat) => cat.id === skill.custom_category_id)
          if (category) {
            return {
              ...skill,
              category: category.name,
              customCategory: category,
            }
          }
        }
        return skill
      }),
    )
  }

  // Get all available categories (predefined + custom)
  const allCategories = [...PREDEFINED_CATEGORIES, ...customCategories.map((cat) => cat.name)]

  return (
    <div className="space-y-8">
      {!supabaseAvailable && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-4">
          <p className="text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>
              <strong>Note:</strong> Supabase connection is unavailable. Changes will be saved to local storage only.
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills Management</h2>
        <Button onClick={syncWithFrontend} variant="outline">
          Sync with Frontend Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="technical">Technical Skills</TabsTrigger>
          <TabsTrigger value="soft">Soft Skills</TabsTrigger>
          <TabsTrigger value="categories">
            <Settings className="h-4 w-4 mr-2" /> Custom Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
              <CardDescription>Manage your technical skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicalSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4 border p-3 rounded-md">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => handleUpdateTechnicalSkill(skill.id, "name", e.target.value)}
                        placeholder="Skill name"
                        required
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={skill.category}
                        onValueChange={(value) => handleUpdateTechnicalSkill(skill.id, "category", value)}
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

                          {/* Custom categories */}
                          {customCategories.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                Custom Categories
                              </div>
                              {customCategories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={skill.level.toString()}
                        onChange={(e) => handleUpdateTechnicalSkill(skill.id, "level", e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteTechnicalSkill(skill.id)}>
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
        </TabsContent>

        <TabsContent value="soft">
          <Card>
            <CardHeader>
              <CardTitle>Soft Skills</CardTitle>
              <CardDescription>Manage your soft skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {softSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4 border p-3 rounded-md">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => handleUpdateSoftSkill(skill.id, "name", e.target.value)}
                        placeholder="Skill name"
                        required
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={skill.level.toString()}
                        onChange={(e) => handleUpdateSoftSkill(skill.id, "level", e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteSoftSkill(skill.id)}>
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
        </TabsContent>

        <TabsContent value="categories">
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCustomCategories}
              disabled={isRefreshing || !supabaseAvailable}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Categories"}
            </Button>
          </div>
          <CustomCategoriesForm initialCategories={customCategories} onSave={handleCustomCategoriesUpdate} />
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={isLoading || isSavingRef.current} className="w-full">
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Skills"}
      </Button>
    </div>
  )
}
