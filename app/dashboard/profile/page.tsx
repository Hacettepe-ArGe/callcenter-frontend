"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordForm } from "@/components/profile/password-form"
import { PointsCard } from "@/components/profile/points-card"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and points</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column - Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <ProfileForm />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <PasswordForm />
          </Card>
        </div>

        {/* Right column - Points */}
        <div className="lg:sticky lg:top-[calc(var(--navbar-height)+2rem)] h-fit">
          <PointsCard />
        </div>
      </div>
    </div>
  )
} 