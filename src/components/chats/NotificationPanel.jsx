"use client"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function NotificationPanel({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="bg-zinc-900 text-white">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-3">
          <p className="text-sm">Rahul sent you a message</p>
          <p className="text-sm">Aman: Are you free?</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}