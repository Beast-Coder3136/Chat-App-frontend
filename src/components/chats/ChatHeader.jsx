
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from 'lucide-react';
import { Bell } from 'lucide-react';
import { useAuthStore } from "../../store/autStore"
import { useEffect, useState } from "react"
import { useChatStore } from "../../store/chatStore";
import { ScrollArea } from "../ui/scroll-area";
import Profile from "./ProfileComponent";

export default function ChatHeader() {
  const { searchUser, authUser, users, logout, notification, setNotification } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { accessChat, setSelectedChat, selectedChat } = useChatStore();
  const [open, setOpen] = useState(false);

  const handleGo = async () => {
    if (searchQuery.trim().length > 0) {
      searchUser(searchQuery);
      setSearchQuery("");
    }
  };

  const handleAccessChat = (userId) => {
    accessChat(userId);
    setOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <header className="h-16 border-b bg-card/30 backdrop-blur-md flex justify-between items-center px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:h-10 md:w-auto md:px-4 md:gap-2">
              <Search className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">Search</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-md border-r bg-card">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl">Find People</SheetTitle>
              <SheetDescription>Search for users to start a conversation.</SheetDescription>
            </SheetHeader>

            <div className="flex gap-2">
              <Input
                placeholder="Name or email..."
                className="bg-muted/50 border-none focus-visible:ring-1"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                onKeyDown={(e) => e.key === 'Enter' && handleGo()}
              />
              <Button onClick={handleGo} className="px-6">Search</Button>
            </div>

            <div className="mt-6 space-y-4">
              {users.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
                        onClick={() => handleAccessChat(user._id)}
                      >
                        <Avatar className="h-12 w-12 border" >
                          <AvatarImage src={user?.profilePic} alt={user?.fullname} />
                          <AvatarFallback>{user?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <p className="font-semibold truncate">{user?.fullname}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <p className="text-sm">Search to find users</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tighter text-primary">TALK-A-TIVE</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="size-6" />
              {notification.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {notification.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {
              notification.length !== 0 ?
                <>
                  {
                    notification.map((notif) => (
                      <DropdownMenuItem
                        key={notif._id}
                        onClick={() => {
                          setNotification(notification.filter((n) => n.chat._id !== notif.chat._id))
                          setSelectedChat(notif.chat)
                        }
                        }
                      >
                        A new Message recieved from {
                          notif.chat.isGroupChat ? notif.chat.chatName : notif.sender.fullname
                        }
                      </DropdownMenuItem>
                    ))
                  }
                </>
                :
                <DropdownMenuItem>No New Message</DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all">
              <AvatarImage src={authUser?.profilePic} alt={authUser?.fullname} />
              <AvatarFallback>{authUser?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <Profile authUser={authUser} handleLogout={handleLogout} />
        </DropdownMenu>
      </div>
    </header>
  );
}