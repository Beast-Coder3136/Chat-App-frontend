import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import { Button } from "@/components/ui/button"
import { UserPen, SendHorizontal, ChevronLeft, MoreVertical, Paperclip, Smile, UserPlus, EllipsisVertical, Pencil, ChevronUp } from 'lucide-react';
import { useChatStore } from "@/store/chatStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState, useRef } from "react"
import { useMessageStore } from "@/store/messageStore"
import { useAuthStore } from "@/store/autStore"
import AddMembers from "./AddMembers";
import ToneChanger from "./ToneChanger";

export default function ChatWindow({ isMobile }) {
  const { selectedChat, setSelectedChat, accessChat, removeMember, renameGroup } = useChatStore();
  const { messages, sendMessage, getAllMessage, recieveMessage } = useMessageStore();
  const { authUser, socket, notification, setNotification, isTyping } = useAuthStore()
  const [content, setContent] = useState("");
  const [filterMessage, setFilterMessage] = useState([]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const scrollRef = useRef(null);
  const [typing ,setTyping ] = useState(false) ;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const message = await sendMessage({
      content,
      chatId: selectedChat._id
    })
    socket.emit("new-message", message)
    setFilterMessage(prev => [...prev, message]);
    setContent("");
    socket.emit("stop-typing", selectedChat._id);
    setIsUserTyping(false);
  }

  useEffect(() => {
    if (selectedChat) {
      const fetch = async () => {
        let fetchMessages = await getAllMessage(selectedChat?._id)
        socket?.emit("join-chat", selectedChat._id); // Join the specific chat room
        setFilterMessage(fetchMessages);
      }
      fetch();
    }
  }, [selectedChat])

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageRecieved) => {
      // If no chat selected, or is not in the currently selected chat
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        // Only add to notification if it's not already there
        if (!notification.find((notif) => notif._id === newMessageRecieved._id)) {
          setNotification([newMessageRecieved, ...notification]);
        }
      } else {
        // If it's the currently selected chat, add to messages list
        setFilterMessage(prev => [...prev, newMessageRecieved]);
      }
    };

    socket.on("message-recieved", handleMessageReceived);

    return () => {
      socket.off("message-recieved", handleMessageReceived);
    };
  }, [selectedChat, notification, socket, setNotification]);

  // useEffect(() => {
  //   if (!socket) return;
  // })

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [filterMessage]);

  const typeHandler = (e) => {
    setContent(e.target.value)
    if (!isTyping) {
      setTyping(true)
      socket.emit("typing", selectedChat?._id)
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat?._id);
        setTyping(false)
      }
    }, timerLength);
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <SendHorizontal className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Select a conversation</h3>
        <p className="max-w-[200px] text-sm mt-2">Choose a chat from the sidebar to start messaging.</p>
      </div>
    );
  }

  const charPartner = selectedChat.isGroupChat
    ? { fullname: selectedChat.chatName, profilePic: '' }
    : selectedChat.users.find(u => u._id !== authUser._id);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Window Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b shrink-0 bg-card/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <Avatar className="h-10 w-10 border shadow-sm">
            <AvatarImage src={charPartner?.profilePic} />
            <AvatarFallback>{charPartner?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm leading-none">{charPartner?.fullname}</h3>
            {/* {isTyping && (
              <p className="text-[10px] text-primary animate-pulse font-medium">typing...</p>
            )} */}
          </div>
        </div>

        <div className="flex items-center gap-1">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <EllipsisVertical className="size-md" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              {selectedChat.isGroupChat ?
                <>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>View Members</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {
                          selectedChat.users.map((user) => {
                            if (user._id === authUser._id) return;

                            return (
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <Button variant="ghost" size="icon">
                                    {user.fullname}
                                  </Button>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    {
                                      selectedChat.groupAdmin._id === authUser._id && <DropdownMenuItem
                                        onClick={() => removeMember({
                                          groupId: selectedChat?._id,
                                          memberId: user._id
                                        }
                                        )}
                                      >Remove</DropdownMenuItem>
                                    }
                                    <DropdownMenuItem
                                      onClick={() => accessChat(user._id)}
                                    >
                                      Chat</DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            )
                          })

                        }

                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </>
                :
                <>
                  <DropdownMenuItem>{charPartner?.fullname}</DropdownMenuItem>
                  <DropdownMenuItem>{charPartner?.email}</DropdownMenuItem>
                </>
              }
            </DropdownMenuContent>
          </DropdownMenu>
          {
            selectedChat.isGroupChat && authUser._id === selectedChat.groupAdmin._id && <AddMembers
              groupId={selectedChat._id} groupMembers={selectedChat.users}
            />
          }

        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 flex flex-col gap-2 min-h-full">
            <div className="grow" /> {/* Push messages to bottom if few */}
            {filterMessage.map((message, i) => (
              <MessageBubble
                key={message._id || i}
                text={message?.content}
                isMe={message?.sender?._id === authUser?._id}
                sender={message?.sender}
                isGroupChat={message?.chat?.isGroupChat}
              />
            ))}
            {
              isTyping && <TypingIndicator />
            }
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 shrink-0 border-t bg-card/5">

        <form
          className="flex gap-2 items-end max-w-5xl mx-auto"
          onSubmit={handleSendMessage}
        >

          <div className="flex-1 bg-muted/50 rounded-2xl border focus-within:ring-1 focus-within:ring-primary/20 transition-all flex items-end p-1 gap-2" >
            {/* <Button type="button" variant="ghost" size="icon" className="rounded-lg  w-fit px-4 text-muted-foreground hover:text-primary">
              Change tone <ChevronUp />
            </Button> */}
            <ToneChanger content={content} setContent={setContent} />
            <textarea
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-2 text-sm min-h-[40px] max-h-32 resize-none"
              placeholder="Message..."
              rows={1}
              value={content}
              onChange={typeHandler}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />

          </div>
          <Button
            type="submit"
            size="icon"
            className="rounded-full h-11 w-11 shrink-0 shadow-lg"
            disabled={!content.trim()}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}