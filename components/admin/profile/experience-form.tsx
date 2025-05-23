"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { updateExperience } from "@/utils/supabase-data-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

interface ExperienceFormProps {
  initialData: ExperienceItem[]
  onSave: (data: ExperienceItem[]) => void
}

export default function ExperienceForm({ initialData, onSave }: ExperienceFormProps) {
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>(initialData)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString())

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    }

    setExperienceItems([...experienceItems, newItem])
    setEditingItem(newItem.id)
    setExpandedItem(newItem.id)
  }

  const handleDeleteExperience = (id: string) => {
    setExperienceItems(experienceItems.filter((item) => item.id !== id))
    if (editingItem === id) setEditingItem(null)
    if (expandedItem === id) setExpandedItem(null)
  }

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const handleEditExperience = (id: string) => {
    setEditingItem(id)
    setExpandedItem(id)
  }

  const handleUpdateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setExperienceItems(
      experienceItems.map((item) => {
        if (item.id === id) {
          // If updating 'current' and it's being set to true, clear the end date
          if (field === "current" && value === true) {
            return { ...item, [field]: value, endDate: "" }
          }
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const handleUpdateDescription = (experienceId: string, index: number, value: string) => {
    setExperienceItems(
      experienceItems.map((item) => {
        if (item.id === experienceId) {
          const description = [...item.description]
          description[index] = value
          return { ...item, description }
        }
        return item
      }),
    )
  }

  const handleAddDescription = (experienceId: string) => {
    setExperienceItems(
      experienceItems.map((item) => {
        if (item.id === experienceId) {
          return { ...item, description: [...item.description, ""] }
        }
        return item
      }),
    )
  }

  const handleDeleteDescription = (experienceId: string, index: number) => {
    setExperienceItems(
      experienceItems.map((item) => {
        if (item.id === experienceId) {
          const description = [...item.description]
          description.splice(index, 1)
          return { ...item, description: description.length ? description : [""] }
        }
        return item
      }),
    )
  }

  // Helper function to parse date string into month and year
  const parseDateString = (dateString: string): { month: string; year: string } => {
    if (!dateString) return { month: "", year: "" }

    // Check if the date is in YYYY-MM format
    if (dateString.includes("-")) {
      const [year, monthNum] = dateString.split("-")
      const monthIndex = Number.parseInt(monthNum) - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        return { month: months[monthIndex], year }
      }
    }

    // Check if the date is in "Month YYYY" format
    const parts = dateString.split(" ")
    if (parts.length === 2) {
      const month = parts[0]
      const year = parts[1]
      if (months.includes(month)) {
        return { month, year }
      }
    }

    return { month: "", year: "" }
  }

  // Helper function to format month and year into a date string
  const formatDateString = (month: string, year: string): string => {
    if (!month || !year) return ""
    return `${month} ${year}`
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Validate data
      const invalidItems = experienceItems.filter((item) => !item.title || !item.company || !item.startDate)

      if (invalidItems.length > 0) {
        throw new Error("Please fill in all required fields for each experience entry")
      }

      // Map to the format expected by the Supabase service
      const experienceData = experienceItems.map((item) => ({
        id: item.id,
        title: item.title,
        company: item.company,
        location: item.location,
        start_date: item.startDate,
        end_date: item.endDate,
        current: item.current,
        descriptions: item.description,
      }))

      // Save to Supabase
      await updateExperience(experienceData)

      // Call the parent's onSave callback
      onSave(experienceItems)

      toast({
        title: "Changes saved",
        description: "Experience section updated successfully",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Experience</h2>
        <Button onClick={handleAddExperience}>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experienceItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  {editingItem === item.id ? (
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdateExperience(item.id, "title", e.target.value)}
                      className="font-bold text-xl mb-1"
                      placeholder="Job Title"
                      required
                    />
                  ) : (
                    <CardTitle>{item.title || "New Position"}</CardTitle>
                  )}

                  {editingItem === item.id ? (
                    <Input
                      value={item.company}
                      onChange={(e) => handleUpdateExperience(item.id, "company", e.target.value)}
                      className="text-sm text-muted-foreground"
                      placeholder="Company"
                      required
                    />
                  ) : (
                    <CardDescription>{item.company}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingItem !== item.id && (
                    <Button variant="outline" size="sm" onClick={() => handleEditExperience(item.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => toggleExpand(item.id)}>
                    {expandedItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteExperience(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedItem === item.id && (
              <CardContent className="pb-4">
                <div className="space-y-4">
                  {editingItem === item.id ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={item.location}
                          onChange={(e) => handleUpdateExperience(item.id, "location", e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Start Date</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={parseDateString(item.startDate).month}
                              onValueChange={(value) => {
                                const { year } = parseDateString(item.startDate)
                                const newDate = formatDateString(value, year)
                                handleUpdateExperience(item.id, "startDate", newDate)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={parseDateString(item.startDate).year}
                              onValueChange={(value) => {
                                const { month } = parseDateString(item.startDate)
                                const newDate = formatDateString(month, value)
                                handleUpdateExperience(item.id, "startDate", newDate)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">End Date</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={parseDateString(item.endDate).month}
                              onValueChange={(value) => {
                                const { year } = parseDateString(item.endDate)
                                const newDate = formatDateString(value, year)
                                handleUpdateExperience(item.id, "endDate", newDate)
                              }}
                              disabled={item.current}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={parseDateString(item.endDate).year}
                              onValueChange={(value) => {
                                const { month } = parseDateString(item.endDate)
                                const newDate = formatDateString(month, value)
                                handleUpdateExperience(item.id, "endDate", newDate)
                              }}
                              disabled={item.current}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              id={`current-${item.id}`}
                              checked={item.current}
                              onCheckedChange={(checked) =>
                                handleUpdateExperience(item.id, "current", checked === true)
                              }
                            />
                            <label
                              htmlFor={`current-${item.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Current position
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Responsibilities/Achievements</label>
                          <Button variant="outline" size="sm" onClick={() => handleAddDescription(item.id)}>
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {item.description.map((desc, index) => (
                            <div key={index} className="flex gap-2">
                              <Textarea
                                value={desc}
                                onChange={(e) => handleUpdateDescription(item.id, index, e.target.value)}
                                placeholder="Describe your responsibilities or achievements"
                                className="flex-1"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteDescription(item.id, index)}
                                disabled={item.description.length <= 1}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
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
                        <p className="text-sm text-muted-foreground">
                          {item.startDate} – {item.current ? "Present" : item.endDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Responsibilities/Achievements</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                          {item.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </div>
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

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Experience"}
      </Button>
    </div>
  )
}
