import { Breadcrumb } from "@/components/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, FileText } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "appointment",
    title: "Upcoming Appointment",
    message: "You have an appointment with Dr. Johnson tomorrow at 2:00 PM.",
    date: "2024-01-31",
  },
  {
    id: 2,
    type: "result",
    title: "Test Results Available",
    message: "Your recent blood test results are now available. Please check your medical records.",
    date: "2024-01-30",
  },
  {
    id: 3,
    type: "reminder",
    title: "Medication Reminder",
    message: "Don't forget to take your evening medication.",
    date: "2024-01-29",
  },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/notifications", label: "Notifications" },
        ]}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="flex items-start space-x-4 p-4">
                  {notification.type === "appointment" && <Calendar className="h-6 w-6 text-blue-500" />}
                  {notification.type === "result" && <FileText className="h-6 w-6 text-green-500" />}
                  {notification.type === "reminder" && <Bell className="h-6 w-6 text-yellow-500" />}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant="outline">{notification.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

