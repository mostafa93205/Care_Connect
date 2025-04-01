"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Upload, File, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/contexts/UserContext"
import { getMedicalRecordById, updateMedicalRecord } from "@/utils/medicalRecordStorage"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function EditMedicalRecordClient({ id }: { id: string }) {
  const { user } = useUser()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [recordData, setRecordData] = useState({
    type: "",
    category: "",
    date: "",
    doctor: "",
    hospital: "",
    description: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [existingFileData, setExistingFileData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!user && typeof window !== "undefined") {
      router.push("/login")
      return
    }

    // Load the medical record
    const record = getMedicalRecordById(id)

    if (!record) {
      setError("Medical record not found")
      return
    }

    // Verify ownership
    if (record.patientId !== user?.id) {
      setError("You do not have permission to edit this record")
      router.push("/medical-records")
      return
    }

    // Set form data
    setRecordData({
      type: record.type || "",
      category: record.category || "",
      date: record.date || "",
      doctor: record.doctor || "",
      hospital: record.hospital || "",
      description: record.description || "",
    })

    // Set file preview if it's an image
    if (record.fileType.startsWith("image/")) {
      setFilePreview(record.fileData)
    }

    // Store existing file data
    setExistingFileData(record.fileData)
  }, [id, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecordData({ ...recordData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (field: string, value: string) => {
    setRecordData({ ...recordData, [field]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the maximum limit of 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`)
      return
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, image, or document file.")
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    if (!recordData.type) {
      setError("Please select a record type")
      return false
    }
    if (!recordData.category) {
      setError("Please select a record category")
      return false
    }
    if (!recordData.date) {
      setError("Please enter the date of the record")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!user) {
      setError("You must be logged in to update a medical record")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let fileBase64 = existingFileData

      // If a new file was selected, convert it to base64
      if (selectedFile) {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })
      }

      const updatedRecord = {
        ...recordData,
        fileName: selectedFile ? selectedFile.name : undefined,
        fileType: selectedFile ? selectedFile.type : undefined,
        fileSize: selectedFile ? selectedFile.size : undefined,
        fileData: fileBase64,
      }

      const success = updateMedicalRecord(id, updatedRecord, user.id)

      if (success) {
        setSuccess(true)

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/medical-records/${id}`)
        }, 2000)
      } else {
        setError("Failed to update medical record. Please try again.")
      }
    } catch (err) {
      console.error("Error updating record:", err)
      setError("An error occurred while updating the record. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/medical-records", label: "Medical Records" },
          { href: `/medical-records/${id}`, label: "View Record" },
          { href: `/medical-records/edit/${id}`, label: "Edit Record" },
        ]}
      />

      <h1 className="text-3xl font-bold">Edit Medical Record</h1>

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
            Your medical record has been updated successfully. You will be redirected to view the record.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Medical Record</CardTitle>
          <CardDescription>Update the details of your medical record</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">
                  Record Type <span className="text-red-500">*</span>
                </Label>
                <Select value={recordData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blood Test">Blood Test</SelectItem>
                    <SelectItem value="X-Ray">X-Ray</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="CT Scan">CT Scan</SelectItem>
                    <SelectItem value="Prescription">Prescription</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Surgery Report">Surgery Report</SelectItem>
                    <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={recordData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Test">Test</SelectItem>
                    <SelectItem value="Imaging">Imaging</SelectItem>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Medical Report">Medical Report</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input id="date" type="date" value={recordData.date} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="doctor">Doctor's Name</Label>
                <Input
                  id="doctor"
                  type="text"
                  value={recordData.doctor}
                  onChange={handleChange}
                  placeholder="Dr. Name"
                />
              </div>

              <div>
                <Label htmlFor="hospital">Hospital/Clinic</Label>
                <Input
                  id="hospital"
                  type="text"
                  value={recordData.hospital}
                  onChange={handleChange}
                  placeholder="Hospital or clinic name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={recordData.description}
                onChange={handleChange}
                placeholder="Add any additional details about this record"
                rows={3}
              />
            </div>

            <div>
              <Label>Update File (Optional)</Label>
              <div className="mt-2">
                {filePreview && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current File:</p>
                    <img
                      src={filePreview || "/placeholder.svg"}
                      alt="Current file preview"
                      className="max-h-40 rounded border"
                    />
                  </div>
                )}

                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-2"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Select New File
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <File className="h-8 w-8 mr-2 text-blue-500" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {filePreview && selectedFile.type.startsWith("image/") && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">New File Preview:</p>
                        <img
                          src={filePreview || "/placeholder.svg"}
                          alt="New file preview"
                          className="max-h-40 rounded border"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Medical Record"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/medical-records/${id}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

