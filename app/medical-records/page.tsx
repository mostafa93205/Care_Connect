"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb } from "@/components/breadcrumb"
import { useUser } from "@/contexts/UserContext"
import { getPatientMedicalRecords, deleteMedicalRecord, getMedicalRecordById } from "@/utils/medicalRecordStorage"
import { useRouter } from "next/navigation"
import { File, FileText, Image, Download, Trash2, Plus, Search, Filter, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function MedicalRecordsPage() {
  const { user } = useUser()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [records, setRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!user && typeof window !== "undefined") {
      router.push("/login")
      return
    }

    // Load records from storage
    if (user) {
      const patientRecords = getPatientMedicalRecords(user.id)
      setRecords(patientRecords)
      setIsLoading(false)
    }
  }, [user, router])

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const handleDelete = (id: string) => {
    if (!user) return

    if (window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      const success = deleteMedicalRecord(id, user.id)
      if (success) {
        setRecords(records.filter((record) => record.id !== id))
      } else {
        alert("Failed to delete record. You may only delete your own records.")
      }
    }
  }

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

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      (record.doctor && record.doctor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.hospital && record.hospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || record.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = [...new Set(records.map((record) => record.category))]

  if (!isClient) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return <div>Loading medical records...</div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/medical-records", label: "Medical Records" },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/medical-records/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard View
            </Link>
          </Button>
          <Button asChild>
            <Link href={records.length === 0 ? "/medical-records/first-upload" : "/medical-records/upload"}>
              <Plus className="mr-2 h-4 w-4" /> Upload New Record
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription>View and manage all your medical records, tests, and prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="w-full md:w-[200px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No records found</h3>
                  <p className="mt-1 text-muted-foreground">
                    {records.length === 0
                      ? "You haven't uploaded any medical records yet."
                      : "No records match your search criteria."}
                  </p>
                  {records.length === 0 && (
                    <Button asChild className="mt-4">
                      <Link href="/medical-records/first-upload">
                        <Plus className="mr-2 h-4 w-4" /> Upload Your First Record
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFileIcon(record.fileType)}
                            <span className="truncate max-w-[150px]">{record.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{record.doctor || "-"}</TableCell>
                        <TableCell>{record.hospital || "-"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(record.id)}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" asChild title="View">
                              <Link href={`/medical-records/${record.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="recent">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords
                    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                    .slice(0, 5)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFileIcon(record.fileType)}
                            <span className="truncate max-w-[150px]">{record.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(record.id)}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" asChild title="View">
                              <Link href={`/medical-records/${record.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="important">
              <div className="text-center py-8">
                <p>Important records feature coming soon.</p>
                <p className="text-muted-foreground">You'll be able to mark records as important for quick access.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

