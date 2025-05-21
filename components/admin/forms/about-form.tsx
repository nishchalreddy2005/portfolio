"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export default function AboutForm() {
  const [formData, setFormData] = useState({
    fullName: "G V R Nishchal Reddy",
    title: "Computer Science Engineer & Tech Enthusiast",
    email: "2200033247cseh@gmail.com",
    phone: "+91 8431099097",
    location: "Vijayawada, India",
    profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0u3lCifx5qGr6LtBszLsZzgAgZoirw.png",
    bio: "I'm a dedicated professional with experience in leading technology and society initiatives at Focus, the student governance body at K L University, and an internship with Indian Railways.",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined or null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to save the data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Changes saved",
        description: "About section updated successfully",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>Update your personal information and bio</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Professional Title
              </label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="profileImage" className="text-sm font-medium">
                Profile Image URL
              </label>
              <Input id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Biography
            </label>
            <Textarea id="bio" name="bio" rows={5} value={formData.bio} onChange={handleChange} />
          </div>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
