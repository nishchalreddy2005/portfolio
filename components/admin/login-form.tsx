"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Lock, User, ArrowLeft, Key } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetKey, setResetKey] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const { login, resetCredentials } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password, rememberMe)
      if (success) {
        // Login successful, the page will re-render to show the dashboard
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setIsLoading(true)

    try {
      if (resetKey !== "2200033247") {
        setResetError("Invalid reset key")
        setIsLoading(false)
        return
      }

      if (!newUsername || !newPassword) {
        setResetError("Username and password are required")
        setIsLoading(false)
        return
      }

      const success = await resetCredentials(newUsername, newPassword)
      if (success) {
        setResetSuccess(true)
        setTimeout(() => {
          setShowResetForm(false)
          setResetSuccess(false)
        }, 3000)
      } else {
        setResetError("Failed to reset credentials")
      }
    } catch (error) {
      setResetError("An error occurred during reset")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Button>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {showResetForm ? "Reset Admin Credentials" : "Admin Login"}
            </CardTitle>
            <CardDescription>
              {showResetForm
                ? "Enter the reset key and your new credentials"
                : "Enter your credentials to access the admin dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="rememberMe" className="text-sm font-medium leading-none">
                    Remember me for 7 days
                  </label>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="resetKey" className="text-sm font-medium">
                    Reset Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="resetKey"
                      type="text"
                      value={resetKey}
                      onChange={(e) => setResetKey(e.target.value)}
                      className="pl-10"
                      placeholder="Enter reset key"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newUsername" className="text-sm font-medium">
                    New Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newUsername"
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="pl-10"
                      placeholder="Enter new username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>

                {resetError && <p className="text-red-500 text-sm">{resetError}</p>}
                {resetSuccess && (
                  <p className="text-green-500 text-sm">Credentials reset successfully! Redirecting to login...</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Credentials"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => {
                setShowResetForm(!showResetForm)
                setError("")
                setResetError("")
              }}
            >
              {showResetForm ? "Back to Login" : "Forgot Password?"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
