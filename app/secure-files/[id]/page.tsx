import SecureFileClient from "./SecureFileClient"

// Generate static params for secure file IDs
export function generateStaticParams() {
  // Generate a range of potential secure file IDs (1-100)
  // This is a workaround since our actual files are stored in localStorage
  return Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
  }))
}

export default function SecureFilePage({ params }: { params: { id: string } }) {
  return <SecureFileClient id={params.id} />
}

