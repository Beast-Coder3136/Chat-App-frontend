export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-muted/30 rounded-full w-fit">
      
      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.10s]"></div>
      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
    </div>
  )
}