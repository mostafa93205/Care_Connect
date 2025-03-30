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
    let userMarker: any = null

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
          // Start with a default location (Cairo, Egypt)
          const defaultLatitude = 30.0592
          const defaultLongitude = 31.2353

          map = L.map("map").setView([defaultLatitude, defaultLongitude], 12)
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

          // Initially set with default location
          setUserLocation([defaultLatitude, defaultLongitude])
          userMarker = L.marker([defaultLatitude, defaultLongitude], { icon: userIcon })
            .addTo(map)
            .bindPopup("Your location")
            .openPopup()

          // Try to get the user's actual location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords

                // Update user location
                setUserLocation([latitude, longitude])

                // Update marker position
                if (userMarker) {
                  userMarker.setLatLng([latitude, longitude])
                  userMarker.bindPopup("Your location").openPopup()
                }

                // Recalculate distances
                const hospitalsWithDistance = hospitals.map((hospital) => ({
                  hospital,
                  distance: calculateDistance(latitude, longitude, hospital.position[0], hospital.position[1]),
                }))

                const sorted = hospitalsWithDistance.sort((a, b) => a.distance - b.distance)
                setSortedHospitals(sorted)

                if (sorted.length > 0) {
                  const nearestHospital = sorted[0].hospital

                  // Remove previous polyline if exists
                  if (map._layers) {
                    Object.keys(map._layers).forEach((layerId) => {
                      if (map._layers[layerId]._path && map._layers[layerId].options.color === "red") {
                        map.removeLayer(map._layers[layerId])
                      }
                    })
                  }

                  // Draw new polyline
                  const polyline = L.polyline([[latitude, longitude], nearestHospital.position], {
                    color: "red",
                  }).addTo(map)

                  if (nearestHospitalMarkerRef.current) {
                    map.removeLayer(nearestHospitalMarkerRef.current)
                  }

                  nearestHospitalMarkerRef.current = L.marker(nearestHospital.position, { icon: hospitalIcon })
                    .addTo(map)
                    .bindPopup(`Nearest Hospital: ${nearestHospital.name}`)
                    .openPopup()

                  const bounds = L.latLngBounds([latitude, longitude], nearestHospital.position)

                  map.fitBounds(bounds, {
                    padding: [50, 50],
                  })
                }
              },
              (error) => {
                console.error("Error getting location:", error)
                // Keep using default location if geolocation fails
                alert("Could not access your location. Using default location instead.")

                // Calculate with default location
                const hospitalsWithDistance = hospitals.map((hospital) => ({
                  hospital,
                  distance: calculateDistance(
                    defaultLatitude,
                    defaultLongitude,
                    hospital.position[0],
                    hospital.position[1],
                  ),
                }))

                const sorted = hospitalsWithDistance.sort((a, b) => a.distance - b.distance)
                setSortedHospitals(sorted)
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              },
            )
          } else {
            alert("Geolocation is not supported by your browser. Using default location.")

            // Calculate with default location
            const hospitalsWithDistance = hospitals.map((hospital) => ({
              hospital,
              distance: calculateDistance(
                defaultLatitude,
                defaultLongitude,
                hospital.position[0],
                hospital.position[1],
              ),
            }))

            const sorted = hospitalsWithDistance.sort((a, b) => a.distance - b.distance)
            setSortedHospitals(sorted)
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

