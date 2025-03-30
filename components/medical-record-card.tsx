"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface MedicalRecordCardProps {
  record: {
    id: string
    type: string
    category: string
    date: string
    doctor?: string
    hospital?: string
    description?: string
    fileName: string
    fileType: string
    uploadDate: string
  }
  onDownload: (id: string) => void
}

export function MedicalRecordCard({ record, onDownload }: MedicalRecordCardProps) {
  const getRecordIcon = () => {
    switch (record.category) {
      case "Test":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "Imaging":
        return <FileText className="h-10 w-10 text-purple-500" />
      case "Medication":
        return <FileText className="h-10 w-10 text-green-500" />
      case "Vaccination":
        return <FileText className="h-10 w-10 text-orange-500" />
      case "Medical Report":
        return <FileText className="h-10 w-10 text-red-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getRecordIcon()}
            <div className="ml-3">
              <CardTitle className="text-lg">{record.type}</CardTitle>
              <p className="text-sm text-muted-foreground">{record.category}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <div className="grid grid-cols-2 gap-1 text-sm mb-4">
            <div>
              <p className="font-medium text-muted-foreground">Date:</p>
              <p>{format(new Date(record.date), "MMM d, yyyy")}</p>
            </div>
            {record.doctor && (
              <div>
                <p className="font-medium text-muted-foreground">Doctor:</p>
                <p className="truncate">{record.doctor}</p>
              </div>
            )}
            {record.hospital && (
              <div className="col-span-2">
                <p className="font-medium text-muted-foreground">Location:</p>
                <p className="truncate">{record.hospital}</p>
              </div>
            )}
          </div>

          {record.description && (
            <div className="mb-4">
              <p className="font-medium text-muted-foreground text-sm">Description:</p>
              <p className="text-sm line-clamp-2">{record.description}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Uploaded: {format(new Date(record.uploadDate), "MMM d, yyyy")}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onDownload(record.id)}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/medical-records/${record.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

