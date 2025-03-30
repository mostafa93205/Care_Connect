"use client"

import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MedicalRecordCard } from "@/components/medical-record-card"
import { useUser } from "@/contexts/UserContext"
import { getPatientMedicalRecords, getMedicalRecordById } from "@/utils/medicalRecordStorage"
import { useRouter } from "next/navigation"
import { Plus, Activity, FileImage, Pill, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function MedicalRecordsDashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [records, setRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load records from storage
    const patientRecords = getPatientMedicalRecords(user.id)
    setRecords(patientRecords)
    setIsLoading(false)
  }, [user, router])

  const handleDownload = (id: string) => {
    const record = getMedicalRecordById(id)
    if (!record) return

    // Create a download link for the file
    const link = document.createElement("a")
    link.href = record.fileData
    link.download = record.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get records by category
  const testRecords = records.filter((record) => record.category === "Test")
  const imagingRecords = records.filter((record) => record.category === "Imaging")
  const medicationRecords = records.filter((record) => record.category === "Medication")
  const vaccinationRecords = records.filter((record) => record.category === "Vaccination")

  // Get recent records
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5)

  if (isLoading) {
    return <div>Loading medical records...</div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/medical-records", label: "Medical Records" },
          { href: "/medical-records/dashboard", label: "Dashboard" },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medical Records Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/medical-records">View All Records</Link>
          </Button>
          <Button asChild>
            <Link href="/medical-records/upload">
              <Plus className="mr-2 h-4 w-4" /> Upload New Record
            </Link>
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Medical Records Found</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              You haven't uploaded any medical records yet. Start by uploading your first record to keep track of your
              health information.
            </p>
            <Button asChild>
              <Link href="/medical-records/first-upload">
                <Plus className="mr-2 h-4 w-4" /> Upload Your First Record
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Recent Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentRecords.map((record) => (
                  <MedicalRecordCard key={record.id} record={record} onDownload={handleDownload} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tests">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tests">
                <Activity className="h-4 w-4 mr-2" /> Tests
              </TabsTrigger>
              <TabsTrigger value="imaging">
                <FileImage className="h-4 w-4 mr-2" /> Imaging
              </TabsTrigger>
              <TabsTrigger value="medications">
                <Pill className="h-4 w-4 mr-2" /> Medications
              </TabsTrigger>
              <TabsTrigger value="vaccinations">
                <Stethoscope className="h-4 w-4 mr-2" /> Vaccinations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tests">
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {testRecords.length === 0 ? (
                    <p className="text-center py-4">No test records found.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {testRecords.map((record) => (
                        <MedicalRecordCard key={record.id} record={record} onDownload={handleDownload} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imaging">
              <Card>
                <CardHeader>
                  <CardTitle>Imaging Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {imagingRecords.length === 0 ? (
                    <p className="text-center py-4">No imaging records found.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {imagingRecords.map((record) => (
                        <MedicalRecordCard key={record.id} record={record} onDownload={handleDownload} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicationRecords.length === 0 ? (
                    <p className="text-center py-4">No medication records found.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {medicationRecords.map((record) => (
                        <MedicalRecordCard key={record.id} record={record} onDownload={handleDownload} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vaccinations">
              <Card>
                <CardHeader>
                  <CardTitle>Vaccination Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {vaccinationRecords.length === 0 ? (
                    <p className="text-center py-4">No vaccination records found.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {vaccinationRecords.map((record) => (
                        <MedicalRecordCard key={record.id} record={record} onDownload={handleDownload} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

