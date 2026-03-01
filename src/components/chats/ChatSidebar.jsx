import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";


import { Button } from "@/components/ui/button"

import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/autStore"
import { useEffect, useState } from "react"
import SearchDrawer from "./SearchDrawer"
import GroupModel from "./GroupModel";
import { cn } from "@/lib/utils";

export default function ChatSidebar() {
  const { authUser, notification, setNotification, socket, onlineUser } = useAuthStore();
  const { Chats, getUserChats, setSelectedChat, selectedChat } = useChatStore();

  const chats = Chats.map((chat) => {
    const users = chat?.users.filter((user) => user?._id !== authUser?._id);
    return { ...chat, users };
  });

  useEffect(() => {
    getUserChats();
  }, [notification]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Heading and Add Group button */}
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Messages</h2>
        <GroupModel groupMembers={chats} />
      </div>

      {/* Show list of chats */}
      <ScrollArea className="h-130">
        <div className="px-3 pb-10">
          {chats.length > 0 ? (
            <div className="space-y-1">
              {chats.map((chat) => {
                const isActive = selectedChat?._id === chat._id;
                const displayName = chat?.isGroupChat ? chat?.chatName : chat?.users[0]?.fullname;
                const profilePic = chat.isGroupChat ? '' : chat?.users[0]?.profilePic;

                // Find notifications for this specific chat
                const chatNotifications = notification.filter(n => n.chat._id === chat._id);
                const notificationCount = chatNotifications.length;

                return (
                  <div
                    key={chat._id}
                    className={`
                      group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-muted active:scale-[0.98]'}
                    `}
                    onClick={() => {
                      setSelectedChat(chat);
                      // Clear notifications for this chat when selected
                      if (notificationCount > 0) {
                        setNotification(notification.filter(n => n.chat._id !== chat._id));
                      }
                    }}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-background rounded-none">
                        {
                          chat.isGroupChat === true ? (
                            <>
                            <AvatarGroup className="h-8 w-8" >
                              <AvatarImage src={chat?.users[0]?.profilePic} className="rounded-full" />
                               <AvatarImage src={chat?.users[1]?.profilePic} className="rounded-full" />
                                <AvatarImage src={chat?.users[2]?.profilePic} className="rounded-f" />

                            </AvatarGroup>
                            </>
                          )
                            : <AvatarImage src={profilePic} alt={displayName} />
                        }
                        <AvatarFallback className={isActive ? 'bg-primary-foreground/20' : ''}>
                          {displayName?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                        {
                          chat.isGroupChat === false && onlineUser.find((id) => id === chat?.users[0]?._id) && <AvatarBadge className="bg-green-600 dark:bg-green-800 " />
                        }
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className={`font-semibold truncate ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {displayName}
                        </p>
                        {notificationCount > 0 && !isActive && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
                            {notificationCount}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs truncate ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'} w-fit`}>

                        <span className="font-semibold" > {chat?.isGroupChat && 'Group Message' }  
                          {
                           chat.isGroupChat === false && (onlineUser.find((id) => id === chat?.users[0]?._id) ? "Online" : "Offline" )
                          }
                           </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs">Start a new chat to begin</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}