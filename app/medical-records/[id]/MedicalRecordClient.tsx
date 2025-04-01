"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMedicalRecordById, deleteMedicalRecord } from "@/utils/medicalRecordStorage"
import { useUser } from "@/contexts/UserContext"
import { Download, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

function MedicalRecordClientComponent({ id }: { id: string }) {
  const router = useRouter()
  const { user } = useUser()
  const [record, setRecord] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!user && typeof window !== "undefined") {
      router.push("/login")
      return
    }

    const fetchRecord = () => {
      const foundRecord = getMedicalRecordById(id as string)

      if (!foundRecord || foundRecord.patientId !== user?.id) {
        router.push("/medical-records")
        return
      }

      setRecord(foundRecord)
      setIsLoading(false)
    }

    if (user) {
      fetchRecord()
    }
  }, [id, user, router])

  const handleDownload = () => {
    if (!record) return

    const link = document.createElement("a")
    link.href = record.fileData
    link.download = record.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = () => {
    if (!record || !user) return

    const success = deleteMedicalRecord(id, user.id)
    if (success) {
      router.push("/medical-records")
    }
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return <div>Loading record...</div>
  }

  if (!record) {
    return <div>Record not found</div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/medical-records", label: "Medical Records" },
          { href: `/medical-records/${id}`, label: record.type },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{record.type}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Records
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/medical-records/edit/${id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your medical record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Record Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-muted-foreground">Type</dt>
                <dd>{record.type}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Category</dt>
                <dd>{record.category}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Date</dt>
                <dd>{format(new Date(record.date), "MMMM d, yyyy")}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Doctor</dt>
                <dd>{record.doctor || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Hospital/Clinic</dt>
                <dd>{record.hospital || "Not specified"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-muted-foreground">Description</dt>
                <dd>{record.description || "No description provided"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">File Name</dt>
                <dd className="truncate">{record.fileName}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">File Size</dt>
                <dd>{(record.fileSize / 1024).toFixed(2)} KB</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Upload Date</dt>
                <dd>{format(new Date(record.uploadDate), "MMMM d, yyyy")}</dd>
              </div>
              {record.lastModified && (
                <div>
                  <dt className="font-medium text-muted-foreground">Last Modified</dt>
                  <dd>{format(new Date(record.lastModified), "MMMM d, yyyy")}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex space-x-2">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {record.fileType.startsWith("image/") ? (
              <div className="flex items-center justify-center">
                <img
                  src={record.fileData || "/placeholder.svg"}
                  alt={record.fileName}
                  className="max-w-full max-h-[400px] object-contain border rounded"
                />
              </div>
            ) : record.fileType.includes("pdf") ? (
              <div className="text-center p-8 border rounded bg-gray-50">
                <p className="mb-4">PDF preview is not available</p>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download to View
                </Button>
              </div>
            ) : (
              <div className="text-center p-8 border rounded bg-gray-50">
                <p className="mb-4">Preview not available for this file type</p>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download to View
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MedicalRecordClientComponent

