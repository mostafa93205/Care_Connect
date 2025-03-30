"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { hospitals, type Hospital } from "@/data/hospitals"
import { useRouter } from "next/navigation"

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function NearbyHospitalsMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [sortedHospitals, setSortedHospitals] = useState<{ hospital: Hospital; distance: number }[]>([])
  const mapRef = useRef<any>(null)
  const nearestHospitalMarkerRef = useRef<any>(null)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let map: any = null
    let L: any = null

    const initMap = async () => {
      try {
        // Dynamically import Leaflet only on the client side
        L = (await import("leaflet")).default

        // Import CSS
        await import("leaflet/dist/leaflet.css")

        const userIcon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })

        const hospitalIcon = L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })

        const mapElement = document.getElementById("map")
        if (mapElement) {
          map = L.map("map").setView([30.0592, 31.2353], 12)
          mapRef.current = map

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map)

          hospitals.forEach((hospital) => {
            L.marker(hospital.position, { icon: hospitalIcon })
              .addTo(map)
              .bindPopup(hospital.name)
              .on("click", () => {
                router.push(`/hospital/${hospital.id}`)
              })
          })

          // Use a default location for static export
          const defaultLatitude = 30.0592
          const defaultLongitude = 31.2353

          setUserLocation([defaultLatitude, defaultLongitude])

          const userMarker = L.marker([defaultLatitude, defaultLongitude], { icon: userIcon })
            .addTo(map)
            .bindPopup("Default location")
            .openPopup()

          const hospitalsWithDistance = hospitals.map((hospital) => ({
            hospital,
            distance: calculateDistance(defaultLatitude, defaultLongitude, hospital.position[0], hospital.position[1]),
          }))

          const sorted = hospitalsWithDistance.sort((a, b) => a.distance - b.distance)
          setSortedHospitals(sorted)

          if (sorted.length > 0) {
            const nearestHospital = sorted[0].hospital
            const polyline = L.polyline([[defaultLatitude, defaultLongitude], nearestHospital.position], {
              color: "red",
            }).addTo(map)

            if (nearestHospitalMarkerRef.current) {
              map.removeLayer(nearestHospitalMarkerRef.current)
            }

            nearestHospitalMarkerRef.current = L.marker(nearestHospital.position, { icon: hospitalIcon })
              .addTo(map)
              .bindPopup(`Nearest Hospital: ${nearestHospital.name}`)
              .openPopup()

            const bounds = L.latLngBounds([defaultLatitude, defaultLongitude], nearestHospital.position)

            map.fitBounds(bounds, {
              padding: [50, 50],
            })
          }
        }
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    if (isClient) {
      initMap()
    }

    return () => {
      if (map) {
        map.off()
        map.remove()
      }
    }
  }, [isClient, router])

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

  if (!isClient) {
    return <div>Loading map...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Hospitals</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="map" style={{ height: "500px", width: "100%" }}></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital Name</TableHead>
              <TableHead>Distance (km)</TableHead>
              <TableHead>Available ICU Beds</TableHead>
              <TableHead>Regular Beds</TableHead>
              <TableHead>Available Consultants</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHospitals.map(({ hospital, distance }) => (
              <TableRow key={hospital.id}>
                <TableCell>{hospital.name}</TableCell>
                <TableCell>{distance.toFixed(2)}</TableCell>
                <TableCell>{hospital.availableICUBeds}</TableCell>
                <TableCell>{hospital.regularBeds}</TableCell>
                <TableCell>{hospital.availableConsultants}</TableCell>
                <TableCell>
                  {hospital.specialties.map((specialty, index) => (
                    <div key={index}>
                      {specialty.name}: {specialty.consultants}
                    </div>
                  ))}
                </TableCell>
                <TableCell className={getStatusColor(hospital.status)}>{hospital.status}</TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`/hospital/${hospital.id}`)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

