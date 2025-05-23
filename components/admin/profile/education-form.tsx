"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, ChevronDown, ChevronUp, Edit, AlertTriangle, Loader2 } from "lucide-react"
import { updateEducation } from "@/utils/supabase-data-service"
import { isSupabaseAvailable } from "@/utils/data-service"
import { defaultProfileData } from "@/utils/local-storage-service"

interface EducationItem {
  id: string
  degree: string
  institution: string
  location: string
  startYear: string
  endYear: string
  grade: string
  specialization?: string
}

interface EducationFormProps {
  initialData: EducationItem[]
  onSave: (data: EducationItem[]) => void
}

export default function EducationForm({ initialData, onSave }: EducationFormProps) {
  const [educationItems, setEducationItems] = useState<EducationItem[]>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [supabaseAvailable, setSupabaseAvailable] = useState(true)
  const { toast } = useToast()

  // Initialize education items from props or default data
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("Initial education data:", initialData)

        // If initialData is empty or doesn't have all 4 entries, use default data
        if (!initialData || initialData.length < 4) {
          console.log("Missing education data, using default data")

          // Map default data to the correct format
          const defaultEducation = defaultProfileData.education.map((item) => ({
            id: item.id.toString(),
            degree: item.degree,
            institution: item.institution,
            location: item.location,
            startYear: item.startYear || "2000", // Default value to prevent null
            endYear: item.endYear || "Present", // Default value to prevent null
            grade: item.grade,
            specialization: item.specialization,
          }))

          setEducationItems(defaultEducation)
        } else {
          // Ensure no null values in the data
          const validatedData = initialData.map((item) => ({
            ...item,
            id: item.id.toString(),
            startYear: item.startYear || "2000", // Default value to prevent null
            endYear: item.endYear || "Present", // Default value to prevent null
          }))
          setEducationItems(validatedData)
        }
      } catch (error) {
        console.error("Error initializing education data:", error)
        // Fallback to empty array if everything fails
        setEducationItems([])
      } finally {
        setIsInitializing(false)
      }
    }

    initializeData()
  }, [initialData])

  // Check if Supabase is available
  useEffect(() => {
    const checkSupabase = async () => {
      const available = await isSupabaseAvailable()
      setSupabaseAvailable(available)
    }
    checkSupabase()
  }, [])

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startYear: "",
      endYear: "",
      grade: "",
      specialization: "",
    }

    setEducationItems([...educationItems, newItem])
    setEditingItem(newItem.id)
    setExpandedItem(newItem.id)
  }

  const handleDeleteEducation = (id: string) => {
    setEducationItems(educationItems.filter((item) => item.id !== id))
    if (editingItem === id) setEditingItem(null)
    if (expandedItem === id) setExpandedItem(null)
  }

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const handleEditEducation = (id: string) => {
    setEditingItem(id)
    setExpandedItem(id)
  }

  const handleUpdateEducation = (id: string, field: keyof EducationItem, value: string) => {
    console.log(`Updating ${field} to ${value} for item ${id}`)
    setEducationItems(educationItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Validate data
      const invalidItems = educationItems.filter((item) => !item.degree || !item.institution)

      if (invalidItems.length > 0) {
        throw new Error("Please fill in all required fields for each education entry")
      }

      // Log the data we're about to save
      console.log("Education data to save:", educationItems)

      // Map to the format expected by the Supabase service
      const educationData = educationItems.map((item) => ({
        id: item.id,
        degree: item.degree,
        institution: item.institution,
        location: item.location,
        start_year: item.startYear,
        end_year: item.endYear,
        grade: item.grade,
        specialization: item.specialization,
        // Also include these fields for the updateEducation function
        startYear: item.startYear,
        endYear: item.endYear,
      }))

      // Save to Supabase if available
      if (supabaseAvailable) {
        await updateEducation(educationData)
      }

      // Call the parent's onSave callback
      onSave(educationItems)

      toast({
        title: "Changes saved",
        description: "Education section updated successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
        duration: 2000, // 2 seconds
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading education data...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button onClick={handleAddEducation}>
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

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

      {educationItems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No education entries found. Click "Add Education" to create one.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {educationItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    {editingItem === item.id ? (
                      <Input
                        value={item.degree}
                        onChange={(e) => handleUpdateEducation(item.id, "degree", e.target.value)}
                        className="font-bold text-xl mb-1"
                        placeholder="Degree/Qualification"
                        required
                      />
                    ) : (
                      <CardTitle>{item.degree || "New Education"}</CardTitle>
                    )}

                    {editingItem === item.id ? (
                      <Input
                        value={item.institution}
                        onChange={(e) => handleUpdateEducation(item.id, "institution", e.target.value)}
                        className="text-sm text-muted-foreground"
                        placeholder="Institution"
                        required
                      />
                    ) : (
                      <CardDescription>{item.institution}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingItem !== item.id && (
                      <Button variant="outline" size="sm" onClick={() => handleEditEducation(item.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => toggleExpand(item.id)}>
                      {expandedItem === item.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteEducation(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedItem === item.id && (
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {editingItem === item.id ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input
                            value={item.location}
                            onChange={(e) => handleUpdateEducation(item.id, "location", e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Start Year</label>
                            <Input
                              type="text"
                              value={item.startYear}
                              onChange={(e) => handleUpdateEducation(item.id, "startYear", e.target.value)}
                              placeholder="YYYY"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">End Year</label>
                            <Input
                              type="text"
                              value={item.endYear}
                              onChange={(e) => handleUpdateEducation(item.id, "endYear", e.target.value)}
                              placeholder="YYYY or Present"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Grade/CGPA</label>
                          <Input
                            value={item.grade}
                            onChange={(e) => handleUpdateEducation(item.id, "grade", e.target.value)}
                            placeholder="e.g., CGPA: 8.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Specialization</label>
                          <Input
                            value={item.specialization || ""}
                            onChange={(e) => handleUpdateEducation(item.id, "specialization", e.target.value)}
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{item.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{`${item.startYear} – ${item.endYear}`}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Grade</p>
                          <p className="text-sm text-muted-foreground">{item.grade}</p>
                        </div>
                        {item.specialization && (
                          <div>
                            <p className="text-sm font-medium">Specialization</p>
                            <p className="text-sm text-muted-foreground">{item.specialization}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              )}

              {editingItem === item.id && expandedItem === item.id && (
                <CardFooter className="flex justify-end pt-0 pb-4 px-6">
                  <Button onClick={() => setEditingItem(null)}>Done Editing</Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Education"}
      </Button>
    </div>
  )
}
