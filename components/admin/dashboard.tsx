"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"
import { SessionActivityTracker } from "./session-activity-tracker"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const { logout, sessionExpiry } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Format the session expiry time
  const formatExpiryTime = () => {
    if (!sessionExpiry) return "Session active"

    const now = new Date()
    const expiry = new Date(sessionExpiry)

    if (expiry <= now) return "Session expired"

    const diffMs = expiry.getTime() - now.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 60) {
      return `Session expires in ${diffMins} minute${diffMins !== 1 ? "s" : ""}`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return `Session expires in ${hours} hour${hours !== 1 ? "s" : ""} ${mins > 0 ? `and ${mins} minute${mins !== 1 ? "s" : ""}` : ""}`
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SessionActivityTracker />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{formatExpiryTime()}</span>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button onClick={() => router.push("/admin/profile")}>Edit Profile</Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button onClick={() => router.push("/admin/seed")}>Seed Database</Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="rounded-md border p-4">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">Analytics features coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="rounded-md border p-4">
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <p className="text-muted-foreground">Messaging features coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="rounded-md border p-4">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p className="text-muted-foreground">User management features coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="rounded-md border p-4">
            <h2 className="text-xl font-semibold mb-2">Advanced Settings</h2>
            <p className="text-muted-foreground">Advanced settings coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
