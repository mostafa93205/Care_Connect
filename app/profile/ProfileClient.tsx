"use client"

import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { QRCodeSVG } from "qrcode.react"
import { useUser } from "@/contexts/UserContext"
import { generateMedicalHistory } from "@/utils/medicalHistoryGenerator"
import Link from "next/link"
import { Edit, Lock } from "lucide-react"

const printStyles = `
@media print {
body * {
  visibility: hidden;
}
.print-section, .print-section * {
  visibility: visible;
}
.print-section {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.no-print {
  display: none !important;
}
.print-break-after {
  break-after: page;
}
@page {
  size: A4;
  margin: 2cm;
}
}
`

export default function ProfileClient() {
  const { user } = useUser()
  const [healthScore, setHealthScore] = useState(75)
  const [activeTab, setActiveTab] = useState("personal") // Added state for activeTab
  const [medicalHistory, setMedicalHistory] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Add print styles
    const style = document.createElement("style")
    style.innerHTML = printStyles
    document.head.appendChild(style)

    return () => {
      if (style && document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setMedicalHistory(generateMedicalHistory(user))
    }
  }, [user])

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  if (!isClient) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6 p-6 bg-gray-100 no-print">
        <Breadcrumb
          items={[
            { href: "/", label: "Home" },
            { href: "/profile", label: "Profile" },
          ]}
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="no-print">
        <TabsList className="bg-white p-2 rounded-lg shadow-md">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className={activeTab === "personal" ? "" : "hidden"}>
        <Card className="bg-white shadow-md mt-4 print-section">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="outline" size="sm" asChild className="no-print">
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="id">ID Number</Label>
                    <Input id="id" value={user.id} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={`${user.firstName} ${user.lastName}`} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={user.phone} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={user.dateOfBirth} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" value={user.gender} readOnly />
                  </div>
                </div>
              </>
            ) : (
              <p>Please log in to view your profile.</p>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Medical History</h2>
              <div className="space-y-4">
                <div>
                  <Label>Health Score</Label>
                  <div className="flex items-center space-x-4">
                    <Progress value={medicalHistory?.healthScore} className="w-full" />
                    <span className="font-bold">{medicalHistory?.healthScore}</span>
                  </div>
                </div>
                <div>
                  <Label>Allergies</Label>
                  <Input value={medicalHistory?.allergies} readOnly />
                </div>
                <div>
                  <Label>Current Medications</Label>
                  <Textarea value={medicalHistory?.currentMedications} readOnly />
                </div>
                <div>
                  <Label>Chronic Conditions</Label>
                  <Input value={medicalHistory?.chronicConditions} readOnly />
                </div>
                <div>
                  <Label>Previous Surgeries</Label>
                  <Textarea value={medicalHistory?.previousSurgeries} readOnly />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <QRCodeSVG value={`https://example.com/profile/${user?.id || "12345"}`} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={activeTab === "settings" ? "" : "hidden"}>
        <Card className="bg-white shadow-md mt-4 no-print">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Edit Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your personal details and contact information</p>
                </div>
                <Button asChild>
                  <Link href="/profile/edit">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Link>
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                </div>
                <Button asChild>
                  <Link href="/profile/change-password">
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                  </Link>
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Manage Medical Records</h3>
                  <p className="text-sm text-muted-foreground">View, upload, and manage your medical records</p>
                </div>
                <Button asChild>
                  <Link href="/medical-records">Manage Records</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 no-print">
        <Button className="w-full" onClick={handlePrint}>
          طباعة المعلومات الشخصية
        </Button>
      </div>
    </div>
  )
}

