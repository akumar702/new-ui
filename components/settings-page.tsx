"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center border-b border-border bg-card px-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl">
          {/* Profile */}
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Profile</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 text-xs text-muted-foreground">Full Name</Label>
                  <Input className="border-border bg-background text-foreground" defaultValue="John Carter" />
                </div>
                <div>
                  <Label className="mb-1.5 text-xs text-muted-foreground">Email</Label>
                  <Input className="border-border bg-background text-foreground" defaultValue="john.carter@company.com" />
                </div>
                <div>
                  <Label className="mb-1.5 text-xs text-muted-foreground">Role</Label>
                  <Input className="border-border bg-background text-foreground" defaultValue="Editor" disabled />
                </div>
                <div>
                  <Label className="mb-1.5 text-xs text-muted-foreground">Department</Label>
                  <Input className="border-border bg-background text-foreground" defaultValue="Technical Publications" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Notifications</h2>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Email notifications for approvals", description: "Get notified when a document is approved or rejected" },
                  { label: "Document update alerts", description: "Receive alerts when documents you follow are updated" },
                  { label: "Weekly digest", description: "Receive a weekly summary of all document activity" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Appearance</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Compact mode</p>
                  <p className="text-xs text-muted-foreground">Reduce spacing and padding throughout the interface</p>
                </div>
                <Switch />
              </div>
              <Separator className="my-4 bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Show block hints</p>
                  <p className="text-xs text-muted-foreground">Display helpful hints when hovering over blocks in the editor</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Security</h2>
              </div>
              <Button variant="outline" className="border-border bg-background text-foreground hover:bg-muted">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
