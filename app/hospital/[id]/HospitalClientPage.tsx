"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { hospitals, type Hospital } from "@/data/hospitals"

export default function HospitalClientPage() {
  const { id } = useParams()
  const [hospital, setHospital] = useState<Hospital | null>(null)

  useEffect(() => {
    const foundHospital = hospitals.find((h) => h.id === Number(id))
    if (foundHospital) {
      setHospital(foundHospital)
    }
  }, [id])

  if (!hospital) {
    return <div>Hospital not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-green-500"
      case "Closed":
        return "text-red-500"
      case "Emergency Only":
        return "text-orange-500"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/nearby-hospitals", label: "Nearby Hospitals" },
          { href: `/hospital/${hospital.id}`, label: hospital.name },
        ]}
      />
      <h1 className="text-3xl font-bold">{hospital.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Address:</h3>
              <p>{hospital.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone:</h3>
              <p>{hospital.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Available ICU Beds:</h3>
              <p>{hospital.availableICUBeds}</p>
            </div>
            <div>
              <h3 className="font-semibold">Regular Beds:</h3>
              <p>{hospital.regularBeds}</p>
            </div>
            <div>
              <h3 className="font-semibold">Available Consultants:</h3>
              <p>{hospital.availableConsultants}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status:</h3>
              <p className={getStatusColor(hospital.status)}>{hospital.status}</p>
            </div>
            <div className="col-span-2">
              <h3 className="font-semibold">Specialties and Available Consultants:</h3>
              <ul className="list-disc list-inside">
                {hospital.specialties.map((specialty, index) => (
                  <li key={index}>
                    {specialty.name}: {specialty.consultants} consultant{specialty.consultants !== 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

