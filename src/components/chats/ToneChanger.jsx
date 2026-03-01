import { GoogleGenAI, ThinkingLevel } from '@google/genai'
import {
  ChevronUp,
  Loader2,
  Sparkles,
  Smile,
  Briefcase,
  Ghost,
  Heart,
  Angry,
  Frown
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../ui/dropdown-menu";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { cn } from "@/lib/utils";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const systemPrompt = `You are an AI message rewriting assistant inside a real-time chat application.

Your task:
Rewrite the user's message according to the selected tone.

Rules:
- Do NOT add explanations.
- Do NOT add quotation marks.
- Do NOT add extra commentary.
- Return ONLY the rewritten message.
- Do not make the message longer than necessary.`

export const tones = [
  "Formal",
  "Professional",
  "Friendly",
  "Casual",
  "Polite",
  "Confident",
  "Motivational",
  "Apologetic",
  "Sarcastic",
  "Humorous",
  "Enthusiastic",
  "Supportive",
  "Empathetic"
];

const ToneChanger = ({ content, setContent }) => {
  const [loadingTone, setLoadingTone] = useState(false);
  const [selectedTone, setSelectedTone] = useState("");

  const handleChangeTone = async (tone) => {
    if (!content || content.trim().length === 0) {
      toast.info("Please write some text first");
      return;
    }
    setLoadingTone(true);
    try {
      setSelectedTone("");
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite", // Updated to a more standard model name if necessary, though flash-preview might work too
        contents: `Rewrite the following message in a ${tone} tone.\nMessage: "${content}"`,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      setSelectedTone(tone);
      setContent(response.text);
    } catch (error) {
      console.log(error.message)
      toast.error("Failed to change tone");
    } finally {
      setLoadingTone(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-10 px-3 rounded-xl border border-transparent hover:border-border transition-all flex items-center gap-2",
            loadingTone ? "opacity-70 cursor-not-allowed" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          )}
          disabled={loadingTone}
        >
          {loadingTone ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span className="text-xs font-medium uppercase tracking-wider">
            {selectedTone || "Tone"}
          </span>
          <ChevronUp className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto p-2 rounded-2xl shadow-xl border-border bg-popover/95 backdrop-blur-sm custom-scrollbar">
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
          Smart Rewrite
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1" />
        <div className="grid gap-0.5">
          {tones.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() => handleChangeTone(item)}
              className="px-3 py-2 rounded-lg cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary"
            >
              <span className="text-sm font-medium">{item}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToneChanger;
