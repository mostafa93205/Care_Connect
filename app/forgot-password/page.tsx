"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يمكنك إضافة منطق إعادة تعيين كلمة المرور
    console.log("إرسال رابط إعادة تعيين كلمة المرور إلى:", email)
    // بعد الإرسال الناجح، يمكنك توجيه المستخدم إلى صفحة تأكيد
    alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.")
    router.push("/login")
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "الرئيسية" },
          { href: "/forgot-password", label: "نسيت كلمة المرور" },
        ]}
      />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>نسيت كلمة المرور</CardTitle>
          <CardDescription>أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              إرسال رابط إعادة التعيين
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            العودة إلى تسجيل الدخول
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

