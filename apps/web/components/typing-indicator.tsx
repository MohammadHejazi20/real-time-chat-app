import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface TypingIndicatorProps {
  isTyping: boolean;
  userName?: string;
}

export function TypingIndicator({ isTyping, userName }: TypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 italic animate-pulse">
      <MessageCircle className="h-4 w-4" />
      <span>
        {userName ? `${userName} is typing...` : 'Someone is typing...'}
      </span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}
