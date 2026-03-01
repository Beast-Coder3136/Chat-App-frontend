"use client"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "../../store/autStore"
import { useEffect, useState } from "react"
import { useChatStore } from "../../store/chatStore"
import { redirect } from "react-router-dom"

export default function SearchDrawer() {
  const { searchUser, users , authUser } = useAuthStore();
  const { accessChat} = useChatStore()
  const [searchQuery, setSearchQuery] = useState("");

  const handleGo = () => {
    if (searchQuery.length > 0) {
      searchUser(searchQuery)
    }
  }
  const handleAccessChat = (userId)=>{
    accessChat(userId)
    redirect("/") ;
  }
  return (
    <Sheet >
      <SheetTrigger asChild >
        <Button variant="outline" className="mt-3 w-full">
          Search User
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="bg-zinc-900 text-white p-4">

        <h2 className="text-lg font-semibold mb-4 text-center">Search Users</h2>
        <div className="px-2 flex gap-4">
          <Input placeholder="Search by name..."
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
         <Button variant={"secondary"} className="cursor-pointer" onClick={handleGo} > Go </Button>
        </div>

        <div className="mt-4 space-y-2">
          {
            users?.length > 0 ?
              users?.map((user) => (
                <>
                <div className="px-4 py-4 border-2 border-accent-foreground flex  items-center"
                onClick={()=> handleAccessChat(user._id)}
                >
                  <p key={user?._id} className="text-2xl font-semibold">
                  {user?.fullname}
                </p>  
                </div>
              
                </>

              ))
              :
              <div className="text-2xl w-full text-center fonr-semibold">No User</div>
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}