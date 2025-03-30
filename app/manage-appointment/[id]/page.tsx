import ManageAppointmentClient from "./ManageAppointmentClient"

// Add generateStaticParams at the top of the file, before the default export
export function generateStaticParams() {
  // Generate a range of potential appointment IDs (1-100)
  // This is a workaround since our actual appointments are stored in localStorage
  return Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
  }))
}

export default function ManageAppointmentPage({ params }: { params: { id: string } }) {
  return <ManageAppointmentClient params={params} />
}

