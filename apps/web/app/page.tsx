"use client";
import { JoinCard } from "@/components/join-card";
import { MessageBubble } from "@/components/message-bubble";
import Show from "@/components/show";
import { TypingIndicator } from "@/components/typing-indicator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatMessage, SOCKET_EVENTS } from "../../../packages/shared";
import { MessageCircle, Send, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [nameSet, setNameSet] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // WebSocket connection
  const { isConnected, emit } = useWebSocket({
    url: "ws://localhost:3001/ws",
    onMessage: (message) => {
      const { type, data } = message;

      switch (type) {
        case SOCKET_EVENTS.CHAT_MESSAGE:
          setMessages((prevMessages) => [...prevMessages, data]);
          break;

        case SOCKET_EVENTS.USERS_LIST:
          setUsers(data);
          break;

        case SOCKET_EVENTS.USER_TYPING:
          setIsTyping(data.isTyping);
          setTypingUser(data.userName || "");
          break;

        case SOCKET_EVENTS.NAME_SET:
          if (data.success) {
            console.log(`Name set successfully: ${data.name}`);
          }
          break;

        case SOCKET_EVENTS.ERROR:
          console.error("Server error:", data.message);
          break;

        default:
          console.warn(`Unknown message type: ${type}`);
      }
    },
    onOpen: () => {
      console.log("Connected to WebSocket server");
    },
    onClose: () => {
      console.log("Disconnected from WebSocket server");
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  const sendMessage = () => {
    if (newMessage.trim() === "" || !isConnected) {
      return;
    }
    emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      id: Date.now().toString(),
      message: newMessage,
    });
    setNewMessage("");
    emit(SOCKET_EVENTS.STOP_TYPING, {});
  };

  const handleSetName = () => {
    if (name && isConnected) {
      emit(SOCKET_EVENTS.SET_NAME, { name });
      setNameSet(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    if (!isConnected) return;

    // Emit typing event
    emit(SOCKET_EVENTS.TYPING, { isTyping: true });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of no input
    typingTimeoutRef.current = setTimeout(() => {
      emit(SOCKET_EVENTS.STOP_TYPING, { isTyping: false });
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Show>
        <Show.When isTrue={!nameSet}>
          <JoinCard
            name={name}
            onNameChange={(v) => {
              setName(v);
            }}
            onSubmit={() => {
              handleSetName();
            }}
          />
        </Show.When>
        <Show.Else>
          <div className="w-full max-w-4xl h-[600px] flex gap-4">
            {/* Connection Status */}
            {!isConnected && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Disconnected
              </div>
            )}

            {/* Users Sidebar */}
            <Card className="w-80 flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Active Users
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {users.length} online
                </Badge>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-slate-500">
                              Online
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  Chat Room
                </CardTitle>
                <TypingIndicator isTyping={isTyping} userName={typingUser} />
              </CardHeader>

              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] px-6">
                  <div className="space-y-4 py-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <MessageBubble
                          key={index}
                          message={message}
                          isOwnMessage={false}
                          showAvatar={true}
                        />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="pt-3">
                <div className="flex gap-2 w-full">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] resize-none"
                    rows={2}
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className="px-4 self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Show.Else>
      </Show>
    </div>
  );
}
