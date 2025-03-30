"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const records = [
  {
    id: 1,
    type: "Blood Test",
    date: "2024-01-15",
    doctor: "Dr. Ahmed",
    result: "Normal",
  },
  {
    id: 2,
    type: "X-Ray",
    date: "2024-01-10",
    doctor: "Dr. Hassan",
    result: "No abnormalities",
  },
  {
    id: 3,
    type: "MRI",
    date: "2023-12-20",
    doctor: "Dr. Youssef",
    result: "Further review needed",
  },
]

export function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRecords = records.filter((record) => {
    return (
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.result.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div>
      <Input
        type="text"
        placeholder="Search records..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.slice(0, 3).map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.doctor}</TableCell>
              <TableCell>{record.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button asChild className="w-full mt-4">
        <Link href="/medical-records">View All Records</Link>
      </Button>
    </div>
  )
}

