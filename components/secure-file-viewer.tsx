"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { getMedicalRecordById } from "@/utils/medicalRecordStorage"

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
  }
}
`

interface SecureFileViewerProps {
  fileUrl: string
}

export function SecureFileViewer({ fileUrl }: SecureFileViewerProps) {
  const [fileContent, setFileContent] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSecureFile = () => {
      try {
        setIsLoading(true)
        // Extract the ID from the fileUrl
        const id = fileUrl.replace("/", "")

        // Get the record directly from localStorage
        const record = getMedicalRecordById(id)

        if (!record) {
          throw new Error("Failed to fetch secure file")
        }

        // Format the data to match the expected structure
        setFileContent({
          patientName: "Patient Name", // You might want to get this from user context
          age: 35, // Placeholder
          sex: "Male", // Placeholder
          pid: record.id,
          referredBy: record.doctor || "Not specified",
          sampleCollectedAt: record.hospital || "Not specified",
          date: record.date,
          results: [
            {
              investigation: record.type,
              result: "See details below",
              referenceValue: "N/A",
              unit: "-",
            },
          ],
          interpretation: record.description || "No description provided",
          imageUrl: record.fileType.startsWith("image/") ? record.fileData : undefined,
          imageType: record.category,
          imageDescription: record.fileName,
        })
      } catch (err) {
        setError("Error fetching secure file. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecureFile()
  }, [fileUrl])

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = printStyles
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return <div>Loading secure file...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto print-section">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Medical Report</CardTitle>
        <p className="text-center text-muted-foreground">CareConnect Health System</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <p>Name: {fileContent.patientName}</p>
              <p>Age: {fileContent.age} Years</p>
              <p>Sex: {fileContent.sex}</p>
              <p>PID: {fileContent.pid}</p>
            </div>
            <div>
              <p>Ref. By: {fileContent.referredBy}</p>
              <p>Sample Collected At: {fileContent.sampleCollectedAt}</p>
              {fileContent.date && <p>Date: {fileContent.date}</p>}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investigation</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Reference Value</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileContent.results.map((result: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{result.investigation}</TableCell>
                  <TableCell>{result.result}</TableCell>
                  <TableCell>{result.referenceValue}</TableCell>
                  <TableCell>{result.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div>
            <h3 className="font-semibold">Interpretation:</h3>
            <p>{fileContent.interpretation}</p>
          </div>

          {fileContent.imageUrl && (
            <div>
              <h3 className="font-semibold">{fileContent.imageType || "Medical"} Image:</h3>
              <div className="relative w-full aspect-square max-w-2xl mx-auto">
                <Image
                  src={fileContent.imageUrl || "/placeholder.svg"}
                  alt={fileContent.imageDescription || "Medical image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {fileContent.imageDescription && (
                <p className="text-sm text-center text-muted-foreground mt-2">{fileContent.imageDescription}</p>
              )}
            </div>
          )}

          {fileContent.medicationDetails && (
            <div>
              <h3 className="font-semibold">Medication Details:</h3>
              <p>Name: {fileContent.medicationDetails.name}</p>
              <p>Dosage: {fileContent.medicationDetails.dosage}</p>
              <p>Frequency: {fileContent.medicationDetails.frequency}</p>
              <Image
                src={fileContent.medicationDetails.imageUrl || "/placeholder.svg"}
                alt="Medication"
                width={200}
                height={200}
              />
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Dr. Emily Johnson (MD, Pathologist)</p>
            <p>Dr. Ahmed Hassan (MD, Radiologist)</p>
            <p>John Doe (Medical Lab Technician, DMLT, BMLT)</p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>CARECONNECT MEDICAL CENTER</p>
            <p>123 Healthcare Street, Medical District, Cairo, Egypt 12345</p>
            <p>+20 123 456 7890 | info@careconnect.eg</p>
            <p>www.careconnect.eg</p>
          </div>

          <Button className="w-full print:hidden" onClick={handlePrint}>
            Print Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

