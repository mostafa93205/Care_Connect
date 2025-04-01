"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/contexts/UserContext"
import { userStorage } from "@/utils/userStorage"

export default function ChangePasswordClient() {
  const { user } = useUser()
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!user && typeof window !== "undefined") {
      router.push("/login")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError("You must be logged in to change your password")
      return
    }

    // Validate password
    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    // Confirm passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    try {
      // Change password
      const success = userStorage.changePassword(user.id, formData.currentPassword, formData.newPassword)

      if (success) {
        setSuccess(true)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } else {
        setError("Current password is incorrect")
      }
    } catch (err) {
      console.error("Error changing password:", err)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  if (!isClient || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/profile", label: "Profile" },
          { href: "/profile/change-password", label: "Change Password" },
        ]}
      />

      <h1 className="text-3xl font-bold">Change Password</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-500">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your password has been changed successfully. You will be redirected to your profile page.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleChange} required />
                <p className="text-sm text-muted-foreground mt-1">Password must be at least 8 characters long</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit">Change Password</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            For security reasons, please use a strong password that you don't use elsewhere.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

