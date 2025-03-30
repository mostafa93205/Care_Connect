import MedicalRecordClient from "./MedicalRecordClient"

// Generate static params for medical record IDs
export function generateStaticParams() {
  // Generate a range of potential medical record IDs (1-200)
  // This is a workaround since our actual records are stored in localStorage
  return Array.from({ length: 200 }, (_, i) => ({
    id: (i + 1).toString(),
  }))
}

export default function MedicalRecordPage({ params }: { params: { id: string } }) {
  return <MedicalRecordClient id={params.id} />
}

