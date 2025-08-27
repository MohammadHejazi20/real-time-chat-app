import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MessageCircle, Clock, User } from "lucide-react";
import { ChatMessage } from "@/my-turborepo/packages/shared";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({
  message,
  isOwnMessage,
  showAvatar = true,
}: MessageBubbleProps) {
  // Convert timestamp string to Date object if needed
  const timestamp =
    typeof message.timestamp === "string"
      ? new Date(message.timestamp)
      : message.timestamp;

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TooltipProvider>
      <div
        className={`flex gap-3 ${
          isOwnMessage ? "justify-end" : "justify-start"
        }`}
      >
        {!isOwnMessage && showAvatar && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Avatar className="h-8 w-8 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                  {message.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
                    {message.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{message.userName}</p>
                  <Badge variant="secondary" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}

        <div className={`max-w-[70%] ${isOwnMessage ? "order-first" : ""}`}>
          {!isOwnMessage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-slate-500 mb-1 cursor-help">
                  {message.userName}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click avatar for more info</p>
              </TooltipContent>
            </Tooltip>
          )}

          <div
            className={`rounded-lg px-3 py-2 relative group ${
              isOwnMessage
                ? "bg-primary text-primary-foreground"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.userMessage}</p>

            {timestamp && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute -bottom-5 text-xs text-slate-400 ${
                      isOwnMessage ? "right-0" : "left-0"
                    } opacity-0 group-hover:opacity-100 transition-opacity cursor-help`}
                  >
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatTime(timestamp)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatDate(timestamp)}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
