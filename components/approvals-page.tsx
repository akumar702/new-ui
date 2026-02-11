"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MessageSquare,
} from "lucide-react"

const pendingReviews = [
  {
    id: "rev-1",
    title: "Safety Procedures Handbook v3.2",
    author: "Sarah Chen",
    authorInitials: "SC",
    submittedAt: "Feb 9, 2026",
    sections: 12,
    comments: 3,
  },
  {
    id: "rev-2",
    title: "Aviation Weather Reference Guide",
    author: "Sarah Chen",
    authorInitials: "SC",
    submittedAt: "Feb 5, 2026",
    sections: 8,
    comments: 0,
  },
  {
    id: "rev-3",
    title: "Emergency Protocol Update - Q1 2026",
    author: "Michael Ross",
    authorInitials: "MR",
    submittedAt: "Feb 4, 2026",
    sections: 5,
    comments: 7,
  },
]

export function ApprovalsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">
            Review and approve submitted documents
          </p>
        </div>
        <Badge className="gap-1.5 bg-warning/15 text-warning border-0">
          <Clock className="h-3 w-3" />
          {pendingReviews.length} pending
        </Badge>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-4">
          {pendingReviews.map((review) => (
            <Card key={review.id} className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                    <FileText className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">{review.title}</h3>
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                            {review.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        {review.author}
                      </span>
                      <span>Submitted {review.submittedAt}</span>
                      <span>{review.sections} sections</span>
                      {review.comments > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {review.comments} comments
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="h-8 gap-1.5 bg-success text-success-foreground text-xs hover:bg-success/90">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 border-destructive/30 bg-transparent text-destructive text-xs hover:bg-destructive/10"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border bg-background text-foreground text-xs hover:bg-muted">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
