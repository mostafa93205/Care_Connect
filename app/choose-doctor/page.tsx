import { Breadcrumb } from "@/components/breadcrumb"
import { DoctorList } from "@/components/doctor-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChooseDoctorPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/choose-doctor", label: "Choose a Doctor" },
        ]}
      />
      <h1 className="text-3xl font-bold">Choose a Doctor</h1>
      <Card>
        <CardHeader>
          <CardTitle>Find the Right Doctor for You</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorList />
        </CardContent>
      </Card>
    </div>
  )
}

