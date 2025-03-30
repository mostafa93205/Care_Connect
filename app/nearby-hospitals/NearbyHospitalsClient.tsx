"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NearbyHospitalsMap } from "@/components/nearby-hospitals-map"

export default function NearbyHospitalsClient() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/nearby-hospitals", label: "Nearby Hospitals" },
        ]}
      />
      <h1 className="text-3xl font-bold">Nearby Hospitals in Egypt</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Search Nearby Hospitals</CardTitle>
        </CardHeader>
        <CardContent>
          <NearbyHospitalsMap />
        </CardContent>
      </Card>
    </div>
  )
}

