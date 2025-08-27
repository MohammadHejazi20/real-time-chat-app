import { useEffect, useRef, useState, useCallback } from "react";
import {
  SOCKET_EVENTS,
  ChatMessage,
  TypingEvent,
} from "@real-time-chat-app/shared";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const { url, onMessage, onOpen, onClose, onError } = options;
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  
  // Use refs to store callbacks to avoid recreating connection on callback changes
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);
  
  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
  });

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log("🔌 WebSocket connected");
        setIsConnected(true);
        onOpenRef.current?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessageRef.current?.(message);
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("🔌 WebSocket disconnected");
        setIsConnected(false);
        setConnectionId(null);
        onCloseRef.current?.();
      };

      ws.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        onErrorRef.current?.(error);
      };
    } catch (error) {
      console.error("❌ Error creating WebSocket:", error);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const sendMessage = useCallback((type: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
      };
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ WebSocket is not connected");
    }
  }, []);

  // Socket.IO-like event emitters
  const emit = useCallback(
    (event: string, data: any) => {
      sendMessage(event, data);
    },
    [sendMessage]
  );

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionId,
    emit,
    sendMessage,
    connect,
    disconnect,
  };
}
