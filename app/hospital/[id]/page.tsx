import { hospitals } from "@/data/hospitals"
import HospitalClientPage from "./HospitalClientPage"

// Add this function at the top of the file, before the default export
export function generateStaticParams() {
  return hospitals.map((hospital) => ({
    id: hospital.id.toString(),
  }))
}

export default function HospitalPage() {
  return <HospitalClientPage />
}

