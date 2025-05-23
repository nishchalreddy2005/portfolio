"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { updateCertifications } from "@/utils/supabase-data-service"

// UUID generation function
function generateUUID() {
  // This is a simplified UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface CertificationItem {
  id: string
  title: string
  issuer: string
  date: string
  certificateUrl: string
}

interface CertificationsFormProps {
  initialData: CertificationItem[]
  onSave: (data: CertificationItem[]) => void
}

export default function CertificationsForm({ initialData, onSave }: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialData)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddCertification = () => {
    const newItem: CertificationItem = {
      id: generateUUID(), // Generate a proper UUID for new items
      title: "",
      issuer: "",
      date: "",
      certificateUrl: "",
    }

    setCertifications([...certifications, newItem])
    setEditingItem(newItem.id)
    setExpandedItem(newItem.id)
  }

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter((item) => item.id !== id))
    if (editingItem === id) setEditingItem(null)
    if (expandedItem === id) setExpandedItem(null)
  }

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const handleEditCertification = (id: string) => {
    setEditingItem(id)
    setExpandedItem(id)
  }

  const handleUpdateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    setCertifications(certifications.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Update the handleSave function to properly format data for Supabase
  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Validate data
      const invalidItems = certifications.filter((item) => !item.title || !item.issuer)

      if (invalidItems.length > 0) {
        throw new Error("Please fill in all required fields for each certification")
      }

      // Map to the format expected by the Supabase service
      const certificationsData = certifications.map((item) => ({
        id: item.id, // Always include the ID (now all are valid UUIDs)
        title: item.title,
        issuer: item.issuer,
        date: item.date || null,
        certificate_url: item.certificateUrl || null,
      }))

      console.log("Saving certifications to Supabase:", certificationsData)

      // Save to Supabase
      await updateCertifications(certificationsData)

      // Call the parent's onSave callback
      onSave(certifications)

      toast({
        title: "Changes saved",
        description: "Certifications updated successfully",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
        duration: 2000, // 2 seconds
      })
    } catch (error) {
      console.error("Error saving certifications:", error)
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
        <h2 className="text-2xl font-bold">Certifications</h2>
        <Button onClick={handleAddCertification}>
          <Plus className="mr-2 h-4 w-4" /> Add Certification
        </Button>
      </div>

      <div className="space-y-4">
        {certifications.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  {editingItem === item.id ? (
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdateCertification(item.id, "title", e.target.value)}
                      className="font-bold text-xl mb-1"
                      placeholder="Certification Title"
                      required
                    />
                  ) : (
                    <CardTitle>{item.title || "New Certification"}</CardTitle>
                  )}

                  {editingItem === item.id ? (
                    <Input
                      value={item.issuer}
                      onChange={(e) => handleUpdateCertification(item.id, "issuer", e.target.value)}
                      className="text-sm text-muted-foreground"
                      placeholder="Issuing Organization"
                      required
                    />
                  ) : (
                    <CardDescription>{item.issuer}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingItem !== item.id && (
                    <Button variant="outline" size="sm" onClick={() => handleEditCertification(item.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => toggleExpand(item.id)}>
                    {expandedItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCertification(item.id)}>
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
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          value={item.date}
                          onChange={(e) => handleUpdateCertification(item.id, "date", e.target.value)}
                          placeholder="Year or Month Year (e.g., 2023 or May 2023)"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Certificate URL</label>
                        <Input
                          value={item.certificateUrl}
                          onChange={(e) => handleUpdateCertification(item.id, "certificateUrl", e.target.value)}
                          placeholder="URL to certificate image or verification page"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>

                      {item.certificateUrl && (
                        <div>
                          <p className="text-sm font-medium">Certificate</p>
                          <a
                            href={item.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Certificate
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
        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save All Certifications"}
      </Button>
    </div>
  )
}
