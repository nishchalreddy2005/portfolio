"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { X, Save, Plus, Trash } from "lucide-react"

export default function AdminPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("about")

  const handleLogout = () => {
    logout()
    onClose()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "default",
    })
  }

  const handleSave = (section: string) => {
    // In a real app, this would save to a database
    toast({
      title: "Changes saved",
      description: `${section} section updated successfully`,
      variant: "default",
      className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
    })
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Portfolio Admin Panel</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* About Section */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Update your personal information and bio</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input id="fullName" defaultValue="G V R Nishchal Reddy" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Professional Title
                      </label>
                      <Input id="title" defaultValue="Computer Science Engineer & Tech Enthusiast" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" defaultValue="2200033247cseh@gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input id="phone" defaultValue="+91 8431099097" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input id="location" defaultValue="Vijayawada, India" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="profileImage" className="text-sm font-medium">
                        Profile Image URL
                      </label>
                      <Input
                        id="profileImage"
                        defaultValue="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0u3lCifx5qGr6LtBszLsZzgAgZoirw.png"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Biography
                    </label>
                    <Textarea
                      id="bio"
                      rows={5}
                      defaultValue="I'm a dedicated professional with experience in leading technology and society initiatives at Focus, the student governance body at K L University, and an internship with Indian Railways."
                    />
                  </div>
                  <Button type="button" onClick={() => handleSave("About")}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills Section</CardTitle>
                <CardDescription>Manage your technical and soft skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                    <div className="space-y-4">
                      {/* Example skill item */}
                      <div className="flex items-center justify-between border p-3 rounded-md">
                        <div>
                          <p className="font-medium">JavaScript</p>
                          <p className="text-sm text-muted-foreground">Languages</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="number" className="w-20" defaultValue="85" min="0" max="100" />
                          <Button variant="destructive" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Technical Skill
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Soft Skills</h3>
                    <div className="space-y-4">
                      {/* Example soft skill item */}
                      <div className="flex items-center justify-between border p-3 rounded-md">
                        <div>
                          <p className="font-medium">Leadership</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="number" className="w-20" defaultValue="85" min="0" max="100" />
                          <Button variant="destructive" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Soft Skill
                      </Button>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("Skills")}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other section tabs would be implemented similarly */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education Section</CardTitle>
                <CardDescription>Manage your educational background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Example education item */}
                  <div className="border p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Degree</label>
                        <Input defaultValue="B.Tech in Computer Science and Engineering (Honours)" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Institution</label>
                        <Input defaultValue="K L University" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input defaultValue="Vaddeshwaram, India" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Period</label>
                        <Input defaultValue="2022 – 2026" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Grade</label>
                        <Input defaultValue="CGPA: 8.5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Specialization</label>
                        <Input defaultValue="Specialization in Distributed Ledger Analytics" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="destructive" size="sm">
                        <Trash className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                  <Button onClick={() => handleSave("Education")} className="mt-6">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder for other sections */}
          {["experience", "projects", "certifications", "contact", "settings"].map((section) => (
            <TabsContent key={section} value={section}>
              <Card>
                <CardHeader>
                  <CardTitle>{section.charAt(0).toUpperCase() + section.slice(1)} Section</CardTitle>
                  <CardDescription>Manage your {section} information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Edit your {section} details here.</p>
                  <Button onClick={() => handleSave(section.charAt(0).toUpperCase() + section.slice(1))}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.div>
  )
}
