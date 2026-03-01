import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MessageBubble({ text, isMe, sender , isGroupChat }) {
  return (
    <div className={`flex w-full mb-2 gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {
       !isMe &&  <Avatar className="h-8 w-8 shrink-0 mt-auto border shadow-sm">
        <AvatarImage src={sender?.profilePic} />
        <AvatarFallback className="text-[10px]">
          {sender?.fullname?.substring(0, 2).toUpperCase() || "??"}
        </AvatarFallback>
      </Avatar>
      }

      <div
        className={`px-4 py-2 rounded-2xl max-w-[80%] lg:max-w-xl text-sm shadow-sm transition-all
          ${isMe
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-secondary-foreground rounded-bl-sm border"
          }`}
      >
        {!isMe && sender?.fullname && isGroupChat &&  (
          <p className="text-[10px] font-bold opacity-70 mb-1">{sender.fullname}</p>
        )}
        <p className="leading-relaxed whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  )
}
