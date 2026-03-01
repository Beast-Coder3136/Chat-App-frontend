import { useEffect, useState } from "react";
import ChatHeader from "../components/chats/ChatHeader";
import ChatSidebar from "../components/chats/ChatSidebar";
import ChatWindow from "../components/chats/ChatWindow";
import { useAuthStore } from "@/store/autStore";
import { useChatStore } from "@/store/chatStore";

const ChatPage = () => {
  const { selectedChat } = useChatStore();
  const { connectSocket } = useAuthStore() ;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(()=>{
    connectSocket() ;
  },[])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <ChatHeader />
      <main className="flex grow overflow-hidden relative">
        {/* On mobile, show sidebar if no chat is selected, or if we want to show the list */}
        <div className={`
                    ${isMobile ? (selectedChat ? 'hidden' : 'w-full') : 'w-80 lg:w-96 border-r'} 
                    h-full flex flex-col bg-card/50 backdrop-blur-sm transition-all duration-300
                `}>
          <ChatSidebar />
        </div>

        {/* On mobile, show chat window if a chat is selected */}
        <div className={`
                    ${isMobile ? (selectedChat ? 'w-full' : 'hidden') : 'grow'} 
                    h-full flex flex-col bg-background
                `}>
          <ChatWindow isMobile={isMobile} />
        </div>
      </main>
    </div>
  );
}

export default ChatPage;