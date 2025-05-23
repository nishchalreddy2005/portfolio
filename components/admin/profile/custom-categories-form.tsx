"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, Edit, Check, X, AlertTriangle, RefreshCw } from "lucide-react"
import {
  createCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
  fetchCustomCategories,
} from "@/utils/supabase-data-service"
import type { CustomCategory } from "@/utils/supabase-data-service"
import { isSupabaseAvailable } from "@/utils/data-service"
import { IconSelector, CustomIcon } from "@/components/custom-icons"

interface CustomCategoriesFormProps {
  initialCategories: CustomCategory[]
  onSave: (categories: CustomCategory[]) => void
}

export default function CustomCategoriesForm({ initialCategories, onSave }: CustomCategoriesFormProps) {
  const [categories, setCategories] = useState<CustomCategory[]>(initialCategories || [])
  const [newCategory, setNewCategory] = useState({ name: "", icon: "hash", color: "" })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
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

  // Function to refresh categories from the database
  const refreshCategories = async () => {
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
      const refreshedCategories = await fetchCustomCategories()
      // Deduplicate categories
      const uniqueCategories = deduplicateCategories(refreshedCategories)
      setCategories(uniqueCategories)

      toast({
        title: "Success",
        description: `Refreshed ${uniqueCategories.length} categories from database`,
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })

      // Also update parent component
      onSave(uniqueCategories)
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

  // Function to add a new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate names
    if (categories.some((cat) => cat.name.toLowerCase().trim() === newCategory.name.toLowerCase().trim())) {
      toast({
        title: "Error",
        description: "A category with this name already exists",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let newCategoryWithId: CustomCategory

      if (supabaseAvailable) {
        // Save to Supabase
        newCategoryWithId = await createCustomCategory({
          name: newCategory.name,
          icon: newCategory.icon || undefined,
          color: newCategory.color || undefined,
        })

        console.log("Created new category in database:", newCategoryWithId)
      } else {
        // Create with a local ID if Supabase is not available
        newCategoryWithId = {
          id: Date.now().toString(),
          name: newCategory.name,
          icon: newCategory.icon || undefined,
          color: newCategory.color || undefined,
        }
      }

      // Update local state
      const updatedCategories = [...categories, newCategoryWithId]
      setCategories(updatedCategories)

      // Call the parent's onSave to update the parent component's state
      onSave(updatedCategories)

      // Reset form
      setNewCategory({ name: "", icon: "hash", color: "" })

      toast({
        title: "Success",
        description: "Category added successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to update a category
  const handleUpdateCategory = async (id: string) => {
    const categoryToUpdate = categories.find((cat) => cat.id === id)
    if (!categoryToUpdate) return

    if (!categoryToUpdate.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate names (excluding the current category)
    if (
      categories.some(
        (cat) => cat.id !== id && cat.name.toLowerCase().trim() === categoryToUpdate.name.toLowerCase().trim(),
      )
    ) {
      toast({
        title: "Error",
        description: "A category with this name already exists",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (supabaseAvailable) {
        // Update in Supabase
        await updateCustomCategory(categoryToUpdate)
        console.log("Updated category in database:", categoryToUpdate)
      }

      // Update local state (already updated through input changes)
      setEditingCategory(null)

      // Call the parent's onSave to update the parent component's state
      onSave(categories)

      toast({
        title: "Success",
        description: "Category updated successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to delete a category
  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true)

    try {
      if (supabaseAvailable) {
        // Delete from Supabase
        await deleteCustomCategory(id)
      }

      // Update local state
      const updatedCategories = categories.filter((cat) => cat.id !== id)
      setCategories(updatedCategories)

      // Call the parent's onSave to update the parent component's state
      onSave(updatedCategories)

      toast({
        title: "Success",
        description: "Category deleted successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle input changes for a category being edited
  const handleEditChange = (id: string, field: keyof CustomCategory, value: string) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)))
  }

  // Function to save all changes
  const handleSaveAll = async () => {
    // Prevent duplicate save operations
    if (isSavingRef.current) {
      console.log("Save operation already in progress, ignoring duplicate request")
      return
    }

    isSavingRef.current = true
    setIsLoading(true)

    try {
      // Deduplicate categories before saving
      const uniqueCategories = deduplicateCategories(categories)
      setCategories(uniqueCategories)

      // Save each category individually to avoid any potential issues
      if (supabaseAvailable) {
        for (const category of uniqueCategories) {
          await updateCustomCategory(category)
        }
      }

      // Call the parent's onSave callback
      onSave(uniqueCategories)

      toast({
        title: "Success",
        description: "All categories saved successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save categories",
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skill Categories</CardTitle>
          <CardDescription>Create and manage categories for your technical skills</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refreshCategories} disabled={isRefreshing || !supabaseAvailable}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Categories"}
        </Button>
      </CardHeader>
      <CardContent>
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

        {/* Add new category form */}
        <div className="mb-6 p-4 border rounded-md bg-muted/10">
          <h3 className="text-lg font-medium mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="categoryName" className="text-sm font-medium">
                Category Name*
              </label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Cloud Services"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Icon</label>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-md border flex items-center justify-center bg-muted/20">
                  <CustomIcon name={newCategory.icon} size={24} color={newCategory.color || undefined} />
                </div>
                <span className="text-sm text-muted-foreground">Selected: {newCategory.icon || "None"}</span>
              </div>
              <IconSelector value={newCategory.icon} onChange={(icon) => setNewCategory({ ...newCategory, icon })} />
            </div>

            <div className="space-y-2">
              <label htmlFor="categoryColor" className="text-sm font-medium">
                Color
              </label>
              <div className="flex gap-2">
                <Input
                  id="categoryColor"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  placeholder="e.g., #3b82f6"
                />
                {newCategory.color && (
                  <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: newCategory.color }} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">Enter a hex color code (optional)</p>
            </div>
          </div>
          <Button onClick={handleAddCategory} className="mt-4" disabled={isLoading || !newCategory.name.trim()}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* Existing categories list */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Categories</h3>

          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No categories yet. Add your first one above.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3 p-3 border rounded-md">
                  {editingCategory === category.id ? (
                    // Edit mode
                    <>
                      <div className="flex-1 grid grid-cols-1 gap-3">
                        <div className="flex gap-2 items-center">
                          <Input
                            value={category.name}
                            onChange={(e) => handleEditChange(category.id, "name", e.target.value)}
                            placeholder="Category name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Icon</label>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-md border flex items-center justify-center bg-muted/20">
                              <CustomIcon name={category.icon || ""} size={20} color={category.color || undefined} />
                            </div>
                            <span className="text-sm text-muted-foreground">Selected: {category.icon || "None"}</span>
                          </div>
                          <IconSelector
                            value={category.icon || ""}
                            onChange={(icon) => handleEditChange(category.id, "icon", icon)}
                          />
                        </div>

                        <div className="flex gap-2 items-center">
                          <Input
                            value={category.color || ""}
                            onChange={(e) => handleEditChange(category.id, "color", e.target.value)}
                            placeholder="Color (optional)"
                          />
                          {category.color && (
                            <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: category.color }} />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateCategory(category.id)}
                          disabled={isLoading}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setEditingCategory(null)}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md border flex items-center justify-center bg-muted/10">
                          <CustomIcon name={category.icon || ""} size={20} color={category.color || undefined} />
                        </div>
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {category.color && (
                            <div
                              className="w-3 h-3 rounded-full inline-block ml-2"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingCategory(category.id)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveAll} disabled={isLoading || isSavingRef.current} className="w-full">
          <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Categories"}
        </Button>
      </CardFooter>
    </Card>
  )
}
