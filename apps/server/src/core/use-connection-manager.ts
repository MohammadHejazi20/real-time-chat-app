import { WebSocket } from "ws";
import type { User } from "@real-time-chat-app/shared";

export class UseConnectionManager {
  private connections = new Map<WebSocket, string>();
  private users = new Map<string, User>();

  addConnection(ws: WebSocket, connectionId: string): void {
    this.connections.set(ws, connectionId);
  }

  removeConnection(ws: WebSocket): string | undefined {
    const connectionId = this.connections.get(ws);
    if (connectionId) {
      this.connections.delete(ws);
      this.users.delete(connectionId);
    }
    return connectionId;
  }

  getConnectionId(ws: WebSocket): string | undefined {
    return this.connections.get(ws);
  }

  addUser(connectionId: string, user: User): void {
    this.users.set(connectionId, user);
  }

  getUser(connectionId: string): User | undefined {
    return this.users.get(connectionId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserList(): { id: string; name: string }[] {
    return this.getAllUsers().map((user) => ({ id: user.id, name: user.name }));
  }

  isNameTaken(name: string, excludeConnectionId?: string): boolean {
    return this.getAllUsers().some(
      (user) =>
        user.name.toLowerCase() === name.toLowerCase() &&
        user.socketId !== excludeConnectionId
    );
  }

  getConnectionCount(): number {
    return this.connections.size;
  }
}
