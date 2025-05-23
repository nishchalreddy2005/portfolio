"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { updateAchievements } from "@/utils/supabase-data-service"

// UUID generation function
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface AchievementItem {
  id: string
  title: string
  description: string
  date: string
  issuer: string
  url: string
}

interface AchievementsFormProps {
  initialData: AchievementItem[]
  onSave: (data: AchievementItem[]) => void
}

export default function AchievementsForm({ initialData, onSave }: AchievementsFormProps) {
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialData)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddAchievement = () => {
    const newItem: AchievementItem = {
      id: generateUUID(),
      title: "",
      description: "",
      date: "",
      issuer: "",
      url: "",
    }

    setAchievements([...achievements, newItem])
    setEditingItem(newItem.id)
    setExpandedItem(newItem.id)
  }

  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter((item) => item.id !== id))
    if (editingItem === id) setEditingItem(null)
    if (expandedItem === id) setExpandedItem(null)
  }

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const handleEditAchievement = (id: string) => {
    setEditingItem(id)
    setExpandedItem(id)
  }

  const handleUpdateAchievement = (id: string, field: keyof AchievementItem, value: string) => {
    setAchievements(achievements.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Validate data
      const invalidItems = achievements.filter((item) => !item.title)

      if (invalidItems.length > 0) {
        throw new Error("Please fill in the title for each achievement")
      }

      console.log("Saving achievements to Supabase:", achievements)

      // Save to Supabase
      await updateAchievements(achievements)

      // Call the parent's onSave callback
      onSave(achievements)

      toast({
        title: "Changes saved",
        description: "Achievements updated successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
        duration: 2000, // 2 seconds
      })
    } catch (error) {
      console.error("Error saving achievements:", error)
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
        <h2 className="text-2xl font-bold">Achievements</h2>
        <Button onClick={handleAddAchievement}>
          <Plus className="mr-2 h-4 w-4" /> Add Achievement
        </Button>
      </div>

      <div className="space-y-4">
        {achievements.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {editingItem === item.id ? (
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdateAchievement(item.id, "title", e.target.value)}
                      className="font-bold text-xl mb-1"
                      placeholder="Achievement Title"
                      required
                    />
                  ) : (
                    <CardTitle>{item.title || "New Achievement"}</CardTitle>
                  )}

                  {editingItem === item.id ? (
                    <Input
                      value={item.issuer}
                      onChange={(e) => handleUpdateAchievement(item.id, "issuer", e.target.value)}
                      className="text-sm text-muted-foreground mt-2"
                      placeholder="Issuing Organization"
                    />
                  ) : (
                    item.issuer && <CardDescription>{item.issuer}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingItem !== item.id && (
                    <Button variant="outline" size="sm" onClick={() => handleEditAchievement(item.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => toggleExpand(item.id)}>
                    {expandedItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteAchievement(item.id)}>
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
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleUpdateAchievement(item.id, "description", e.target.value)}
                          placeholder="Describe your achievement"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          value={item.date}
                          onChange={(e) => handleUpdateAchievement(item.id, "date", e.target.value)}
                          placeholder="Year or Month Year (e.g., 2023 or May 2023)"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">URL</label>
                        <Input
                          value={item.url}
                          onChange={(e) => handleUpdateAchievement(item.id, "url", e.target.value)}
                          placeholder="Link to achievement details or proof"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {item.description && (
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      )}

                      {item.date && (
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      )}

                      {item.url && (
                        <div>
                          <p className="text-sm font-medium">URL</p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Achievement
                          </a>
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

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Achievements"}
      </Button>
    </div>
  )
}
