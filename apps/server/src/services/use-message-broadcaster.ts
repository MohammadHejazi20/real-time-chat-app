import { WebSocket, WebSocketServer } from "ws";
import { SOCKET_EVENTS } from "@real-time-chat-app/shared";
import { UseConnectionManager } from "../core/use-connection-manager";

export class UseMessageBroadcaster {
  constructor(
    private wss: WebSocketServer,
    private connectionManager: UseConnectionManager
  ) {}

  broadcastToAll(type: string, data: any): void {
    const message = this.createMessage(type, data);
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastToOthers(sender: WebSocket, type: string, data: any): void {
    const message = this.createMessage(type, data);
    this.wss.clients.forEach((client: WebSocket) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  sendToClient(ws: WebSocket, type: string, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      const message = this.createMessage(type, data);
      ws.send(message);
    }
  }

  broadcastUsersList(): void {
    const usersList = this.connectionManager.getUserList();
    this.broadcastToAll(SOCKET_EVENTS.USERS_LIST, usersList);
  }

  private createMessage(type: string, data: any): string {
    return JSON.stringify({ type, data, timestamp: Date.now() });
  }
}
