"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload, File, X, FileText, FileImage, Pill, Stethoscope, Activity } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/contexts/UserContext"
import { uploadMedicalRecord } from "@/utils/medicalRecordStorage"
import { format } from "date-fns"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Templates for different record types
const recordTemplates = {
  bloodTest: {
    type: "Blood Test",
    category: "Test",
    description: "Complete blood count (CBC) test results",
    fields: [
      { name: "hemoglobin", label: "Hemoglobin (g/dL)", placeholder: "e.g., 14.5" },
      { name: "whiteBloodCells", label: "White Blood Cells (cells/mm³)", placeholder: "e.g., 7500" },
      { name: "platelets", label: "Platelets (cells/mm³)", placeholder: "e.g., 250000" },
      { name: "glucose", label: "Glucose (mg/dL)", placeholder: "e.g., 95" },
      { name: "cholesterol", label: "Total Cholesterol (mg/dL)", placeholder: "e.g., 180" },
    ],
  },
  imaging: {
    type: "X-Ray",
    category: "Imaging",
    description: "Chest X-ray examination",
    fields: [
      { name: "bodyPart", label: "Body Part", placeholder: "e.g., Chest, Knee, Spine" },
      { name: "findings", label: "Findings", placeholder: "e.g., No abnormalities detected" },
      { name: "radiologistName", label: "Radiologist Name", placeholder: "e.g., Dr. Ahmed Hassan" },
    ],
  },
  medication: {
    type: "Prescription",
    category: "Medication",
    description: "Medication prescription details",
    fields: [
      { name: "medicationName", label: "Medication Name", placeholder: "e.g., Amoxicillin" },
      { name: "dosage", label: "Dosage", placeholder: "e.g., 500mg" },
      { name: "frequency", label: "Frequency", placeholder: "e.g., Twice daily" },
      { name: "duration", label: "Duration", placeholder: "e.g., 7 days" },
      { name: "instructions", label: "Special Instructions", placeholder: "e.g., Take with food" },
    ],
  },
  labResult: {
    type: "Lab Result",
    category: "Test",
    description: "Laboratory test results",
    fields: [
      { name: "testName", label: "Test Name", placeholder: "e.g., Liver Function Test" },
      { name: "results", label: "Results", placeholder: "e.g., ALT: 25 U/L, AST: 22 U/L" },
      { name: "referenceRange", label: "Reference Range", placeholder: "e.g., ALT: 7-55 U/L, AST: 8-48 U/L" },
    ],
  },
  vaccination: {
    type: "Vaccination",
    category: "Vaccination",
    description: "Vaccination record",
    fields: [
      { name: "vaccineName", label: "Vaccine Name", placeholder: "e.g., COVID-19, Influenza" },
      { name: "manufacturer", label: "Manufacturer", placeholder: "e.g., Pfizer, Moderna" },
      { name: "doseNumber", label: "Dose Number", placeholder: "e.g., 1, 2, Booster" },
      { name: "nextDoseDate", label: "Next Dose Date (if applicable)", placeholder: "YYYY-MM-DD" },
    ],
  },
}

export default function FirstUploadClient() {
  const { user } = useUser()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("bloodTest")

  const [recordData, setRecordData] = useState({
    type: recordTemplates.bloodTest.type,
    category: recordTemplates.bloodTest.category,
    date: format(new Date(), "yyyy-MM-dd"),
    doctor: "",
    hospital: "",
    description: recordTemplates.bloodTest.description,
    customFields: {} as Record<string, string>,
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Update record data when tab changes
    const template = recordTemplates[activeTab as keyof typeof recordTemplates]
    setRecordData({
      ...recordData,
      type: template.type,
      category: template.category,
      description: template.description,
      customFields: {},
    })
  }, [activeTab])

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/login")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecordData({ ...recordData, [e.target.id]: e.target.value })
  }

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setRecordData({
      ...recordData,
      customFields: {
        ...recordData.customFields,
        [fieldName]: value,
      },
    })
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
    if (!recordData.date) {
      setError("Please enter the date of the record")
      return false
    }

    // For the first upload, we'll make the file optional
    // if (!selectedFile) {
    //   setError("Please upload a file")
    //   return false
    // }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Convert file to base64 for storage if a file was selected
      let fileBase64 = ""
      if (selectedFile) {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })
      }

      const record = {
        id: Date.now().toString(),
        patientId: user?.id || "guest",
        type: recordData.type,
        category: recordData.category,
        date: recordData.date,
        doctor: recordData.doctor,
        hospital: recordData.hospital,
        description: recordData.description,
        customFields: recordData.customFields,
        fileName: selectedFile ? selectedFile.name : `${recordData.type} - ${recordData.date}.txt`,
        fileType: selectedFile ? selectedFile.type : "text/plain",
        fileSize: selectedFile ? selectedFile.size : 0,
        fileData: fileBase64 || "data:text/plain;base64,", // Empty text file if no file uploaded
        uploadDate: new Date().toISOString(),
      }

      uploadMedicalRecord(record)

      setSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/medical-records")
      }, 2000)
    } catch (err) {
      setError("An error occurred while uploading the record. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case "bloodTest":
        return <Activity className="h-4 w-4 mr-2" />
      case "imaging":
        return <FileImage className="h-4 w-4 mr-2" />
      case "medication":
        return <Pill className="h-4 w-4 mr-2" />
      case "labResult":
        return <FileText className="h-4 w-4 mr-2" />
      case "vaccination":
        return <Stethoscope className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/medical-records", label: "Medical Records" },
          { href: "/medical-records/first-upload", label: "Upload Your First Record" },
        ]}
      />

      <h1 className="text-3xl font-bold">Upload Your First Medical Record</h1>

      <Alert className="bg-blue-50 border-blue-500">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle>Getting Started</AlertTitle>
        <AlertDescription>
          Welcome to your medical records! Start by uploading your first health document. Choose a template below that
          best matches your record.
        </AlertDescription>
      </Alert>

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
            Your medical record has been uploaded successfully. You will be redirected to the records page.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Select Record Type</CardTitle>
          <CardDescription>Choose the type of medical record you want to upload</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              <TabsTrigger value="bloodTest">{getTabIcon("bloodTest")} Blood Test</TabsTrigger>
              <TabsTrigger value="imaging">{getTabIcon("imaging")} Imaging</TabsTrigger>
              <TabsTrigger value="medication">{getTabIcon("medication")} Medication</TabsTrigger>
              <TabsTrigger value="labResult">{getTabIcon("labResult")} Lab Result</TabsTrigger>
              <TabsTrigger value="vaccination">{getTabIcon("vaccination")} Vaccination</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="bloodTest">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                      <Label htmlFor="hospital">Hospital/Laboratory</Label>
                      <Input
                        id="hospital"
                        type="text"
                        value={recordData.hospital}
                        onChange={handleChange}
                        placeholder="Hospital or laboratory name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={recordData.description} onChange={handleChange} rows={2} />
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-3">Blood Test Results</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {recordTemplates.bloodTest.fields.map((field) => (
                        <div key={field.name}>
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Input
                            id={field.name}
                            value={recordData.customFields[field.name] || ""}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="imaging">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="type">Imaging Type</Label>
                      <Select value={recordData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select imaging type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="X-Ray">X-Ray</SelectItem>
                          <SelectItem value="MRI">MRI</SelectItem>
                          <SelectItem value="CT Scan">CT Scan</SelectItem>
                          <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                          <SelectItem value="Mammogram">Mammogram</SelectItem>
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
                      <Label htmlFor="doctor">Doctor/Radiologist</Label>
                      <Input
                        id="doctor"
                        type="text"
                        value={recordData.doctor}
                        onChange={handleChange}
                        placeholder="Dr. Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hospital">Hospital/Imaging Center</Label>
                      <Input
                        id="hospital"
                        type="text"
                        value={recordData.hospital}
                        onChange={handleChange}
                        placeholder="Hospital or imaging center name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={recordData.description} onChange={handleChange} rows={2} />
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-3">Imaging Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {recordTemplates.imaging.fields.map((field) => (
                        <div key={field.name} className={field.name === "findings" ? "md:col-span-2" : ""}>
                          <Label htmlFor={field.name}>{field.label}</Label>
                          {field.name === "findings" ? (
                            <Textarea
                              id={field.name}
                              value={recordData.customFields[field.name] || ""}
                              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              rows={3}
                            />
                          ) : (
                            <Input
                              id={field.name}
                              value={recordData.customFields[field.name] || ""}
                              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medication">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="type">Record Type</Label>
                      <Select value={recordData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Prescription">Prescription</SelectItem>
                          <SelectItem value="Medication List">Medication List</SelectItem>
                          <SelectItem value="Pharmacy Receipt">Pharmacy Receipt</SelectItem>
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
                      <Label htmlFor="doctor">Prescribing Doctor</Label>
                      <Input
                        id="doctor"
                        type="text"
                        value={recordData.doctor}
                        onChange={handleChange}
                        placeholder="Dr. Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hospital">Hospital/Pharmacy</Label>
                      <Input
                        id="hospital"
                        type="text"
                        value={recordData.hospital}
                        onChange={handleChange}
                        placeholder="Hospital or pharmacy name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={recordData.description} onChange={handleChange} rows={2} />
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-3">Medication Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {recordTemplates.medication.fields.map((field) => (
                        <div key={field.name} className={field.name === "instructions" ? "md:col-span-2" : ""}>
                          <Label htmlFor={field.name}>{field.label}</Label>
                          {field.name === "instructions" ? (
                            <Textarea
                              id={field.name}
                              value={recordData.customFields[field.name] || ""}
                              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              rows={2}
                            />
                          ) : (
                            <Input
                              id={field.name}
                              value={recordData.customFields[field.name] || ""}
                              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="labResult">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="date">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input id="date" type="date" value={recordData.date} onChange={handleChange} />
                    </div>

                    <div>
                      <Label htmlFor="doctor">Ordering Doctor</Label>
                      <Input
                        id="doctor"
                        type="text"
                        value={recordData.doctor}
                        onChange={handleChange}
                        placeholder="Dr. Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hospital">Laboratory</Label>
                      <Input
                        id="hospital"
                        type="text"
                        value={recordData.hospital}
                        onChange={handleChange}
                        placeholder="Laboratory name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={recordData.description} onChange={handleChange} rows={2} />
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-3">Lab Test Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {recordTemplates.labResult.fields.map((field) => (
                        <div
                          key={field.name}
                          className={field.name === "results" || field.name === "referenceRange" ? "md:col-span-2" : ""}
                        >
                          <Label htmlFor={field.name}>{field.label}</Label>
                          {field.name === "results" || field.name === "referenceRange" ? (
                            <Textarea
                              id={field.name}
                              value={recordData.customFields[field.name] || ""}
                              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              rows={2}
                            />
                          ) : (
                            <Input
                              id={field.name}
                              value={recordData.customFields[field.name] || ""}
                              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vaccination">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="date">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input id="date" type="date" value={recordData.date} onChange={handleChange} />
                    </div>

                    <div>
                      <Label htmlFor="doctor">Healthcare Provider</Label>
                      <Input
                        id="doctor"
                        type="text"
                        value={recordData.doctor}
                        onChange={handleChange}
                        placeholder="Dr. Name or Nurse Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hospital">Vaccination Center</Label>
                      <Input
                        id="hospital"
                        type="text"
                        value={recordData.hospital}
                        onChange={handleChange}
                        placeholder="Hospital or vaccination center"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={recordData.description} onChange={handleChange} rows={2} />
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-3">Vaccination Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {recordTemplates.vaccination.fields.map((field) => (
                        <div key={field.name}>
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Input
                            id={field.name}
                            type={field.name === "nextDoseDate" ? "date" : "text"}
                            value={recordData.customFields[field.name] || ""}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <div>
                <Label>Upload File (Optional)</Label>
                <div className="mt-2">
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
                        <Upload className="mr-2 h-4 w-4" /> Select File
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

                      {filePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <img
                            src={filePreview || "/placeholder.svg"}
                            alt="File preview"
                            className="max-h-40 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Save Medical Record"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Your records are stored securely and only accessible by you.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

