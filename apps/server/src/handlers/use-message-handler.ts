import { WebSocket } from "ws";
import type {
  ChatMessage,
  User,
  TypingEvent,
} from "@real-time-chat-app/shared";
import { SOCKET_EVENTS } from "@real-time-chat-app/shared";
import { UseConnectionManager } from "../core/use-connection-manager";
import { UseMessageBroadcaster } from "../services/use-message-broadcaster";

export class UseMessageHandler {
  constructor(
    private connectionManager: UseConnectionManager,
    private broadcaster: UseMessageBroadcaster
  ) {}

  handleMessage(ws: WebSocket, message: { type: string; data: any }): void {
    const { type, data } = message;

    switch (type) {
      case SOCKET_EVENTS.SET_NAME:
        this.handleSetName(ws, data.name);
        break;

      case SOCKET_EVENTS.CHAT_MESSAGE:
        this.handleChatMessage(ws, data);
        break;

      case SOCKET_EVENTS.TYPING:
        this.handleTyping(ws, data.isTyping ?? true);
        break;

      case SOCKET_EVENTS.STOP_TYPING:
        this.handleTyping(ws, data.isTyping ?? false);
        break;

      default:
        console.warn(`Unknown message type: ${type}`);
        this.sendError(ws, `Unknown message type: ${type}`);
    }
  }

  private handleSetName(ws: WebSocket, name: string): void {
    try {
      const connectionId = this.connectionManager.getConnectionId(ws);
      if (!connectionId) {
        this.sendError(ws, "Connection not found");
        return;
      }

      if (!this.isValidName(name)) {
        this.sendError(ws, "Invalid name provided");
        return;
      }

      const trimmedName = name.trim();

      if (this.connectionManager.isNameTaken(trimmedName, connectionId)) {
        this.sendError(ws, "Name already taken");
        return;
      }

      const user: User = {
        id: connectionId,
        name: trimmedName,
        socketId: connectionId,
      };

      this.connectionManager.addUser(connectionId, user);
      this.broadcaster.broadcastUsersList();

      console.log(`User ${trimmedName} joined the chat`);
      this.sendMessage(ws, SOCKET_EVENTS.NAME_SET, {
        success: true,
        name: trimmedName,
      });
    } catch (error) {
      console.error("Error setting name:", error);
      this.sendError(ws, "Failed to set name");
    }
  }

  private handleChatMessage(
    ws: WebSocket,
    data: { id: string; message: string }
  ): void {
    try {
      const connectionId = this.connectionManager.getConnectionId(ws);
      if (!connectionId) {
        this.sendError(ws, "Connection not found");
        return;
      }

      const user = this.connectionManager.getUser(connectionId);
      if (!user) {
        this.sendError(ws, "Please set your name first");
        return;
      }

      if (!this.isValidMessage(data.message)) {
        this.sendError(ws, "Invalid message");
        return;
      }

      const chatMessage: ChatMessage = {
        userId: connectionId,
        userMessage: data.message.trim(),
        userName: user.name,
        timestamp: new Date(),
      };

      this.broadcaster.broadcastToAll(SOCKET_EVENTS.CHAT_MESSAGE, chatMessage);
      console.log(`Message from ${user.name}: ${data.message}`);
    } catch (error) {
      console.error("Error handling chat message:", error);
      this.sendError(ws, "Failed to send message");
    }
  }

  private handleTyping(ws: WebSocket, isTyping: boolean): void {
    try {
      const connectionId = this.connectionManager.getConnectionId(ws);
      if (!connectionId) return;

      const user = this.connectionManager.getUser(connectionId);
      if (user) {
        const typingEvent: TypingEvent = {
          isTyping: isTyping,
          userName: user.name,
        };

        this.broadcaster.broadcastToOthers(
          ws,
          SOCKET_EVENTS.USER_TYPING,
          typingEvent
        );
      }
    } catch (error) {
      console.error("Error handling typing event:", error);
    }
  }

  private isValidName(name: string): boolean {
    return typeof name === "string" && name.trim().length > 0;
  }

  private isValidMessage(message: string): boolean {
    return typeof message === "string" && message.trim().length > 0;
  }

  private sendMessage(ws: WebSocket, type: string, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, data, timestamp: Date.now() });
      ws.send(message);
    }
  }

  private sendError(ws: WebSocket, message: string): void {
    this.sendMessage(ws, SOCKET_EVENTS.ERROR, { message });
  }
}
