"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MedicalRecords } from "@/components/medical-records"
import { NewsFeed } from "@/components/news-feed"
import { NearbyHospitalsMap } from "@/components/nearby-hospitals-map"
import { Advertisements } from "@/components/advertisements"
import { PersonalizedHealthDashboard } from "@/components/personalized-health-dashboard"
import { BloodSugarMonitoring } from "@/components/blood-sugar-monitoring"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"

export default function Home() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Welcome to CareConnect, {user.firstName}</h2>
      </div>
      <Advertisements />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <PersonalizedHealthDashboard />
          <BloodSugarMonitoring />
        </div>
        <div className="space-y-4">
          <NearbyHospitalsMap />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <MedicalRecords />
            </CardContent>
          </Card>
          <NewsFeed />
        </div>
      </div>
    </div>
  )
}

