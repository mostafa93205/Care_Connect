"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import { SecureFileViewer } from "@/components/secure-file-viewer"

export default function SecureFileClient({ id }: { id: string }) {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/medical-records", label: "Medical Records" },
          { href: `/secure-files/${id}`, label: "Secure File" },
        ]}
      />
      <h1 className="text-3xl font-bold">Secure File Viewer</h1>
      <SecureFileViewer fileUrl={`/${id}`} />
    </div>
  )
}

