import { WebSocketServer, WebSocket } from "ws";
import { createServer, Server } from "http";
import { UseConnectionManager } from "./use-connection-manager";
import { UseMessageHandler } from "../handlers/use-message-handler";
import { UseMessageBroadcaster } from "../services/use-message-broadcaster";
import { SERVER_CONFIG } from "../config";

export class UseWebSocketServer {
  private server: Server;
  private wss: WebSocketServer;
  private connectionManager: UseConnectionManager;
  private messageHandler: UseMessageHandler;
  private broadcaster: UseMessageBroadcaster;
  private heartbeat: NodeJS.Timeout;

  constructor() {
    this.server = createServer();
    this.wss = new WebSocketServer({
      server: this.server,
      path: SERVER_CONFIG.WS_PATH,
      maxPayload: 1024 * 1024, // 1MB max payload
    });

    this.connectionManager = new UseConnectionManager();
    this.broadcaster = new UseMessageBroadcaster(
      this.wss,
      this.connectionManager
    );
    this.messageHandler = new UseMessageHandler(
      this.connectionManager,
      this.broadcaster
    );

    this.setupEventHandlers();
    this.setupHeartbeat();
  }

  private setupEventHandlers(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      this.handleNewConnection(ws);
    });
  }

  private handleNewConnection(ws: WebSocket): void {
    const connectionId = this.generateConnectionId();
    console.log(`New WebSocket connection: ${connectionId}`);

    this.connectionManager.addConnection(ws, connectionId);

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.messageHandler.handleMessage(ws, message);
      } catch (error) {
        console.error("Error parsing message:", error);
        this.broadcaster.sendToClient(ws, "error", {
          message: "Invalid message format",
        });
      }
    });

    ws.on("close", () => {
      this.handleDisconnect(ws);
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
      this.handleDisconnect(ws);
    });
  }

  private handleDisconnect(ws: WebSocket): void {
    try {
      const connectionId = this.connectionManager.removeConnection(ws);
      if (connectionId) {
        const user = this.connectionManager.getUser(connectionId);
        if (user) {
          console.log(`User ${user.name} disconnected`);
        }

        this.broadcaster.broadcastUsersList();
      }
    } catch (error) {
      console.error("❌ Error handling disconnect:", error);
    }
  }

  private setupHeartbeat(): void {
    this.heartbeat = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        if (ws.readyState === WebSocket.CLOSED) {
          const connectionId = this.connectionManager.getConnectionId(ws);
          console.log(`💀 Terminating inactive connection: ${connectionId}`);
          this.connectionManager.removeConnection(ws);
          ws.terminate();
        } else {
          ws.ping();
        }
      });
    }, SERVER_CONFIG.HEARTBEAT_INTERVAL);
  }

  private generateConnectionId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  start(): void {
    this.server.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
      console.log(
        `🚀 WebSocket server running on ws://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}${SERVER_CONFIG.WS_PATH}`
      );
      console.log(`📊 Max connections: ${SERVER_CONFIG.MAX_CONNECTIONS}`);
      console.log(`Heartbeat interval: ${SERVER_CONFIG.HEARTBEAT_INTERVAL}ms`);
      console.log(`Environment: ${SERVER_CONFIG.NODE_ENV}`);
    });
  }

  stop(): void {
    console.log("Shutting down WebSocket server gracefully...");
    clearInterval(this.heartbeat);
    this.wss.close(() => {
      this.server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });
  }

  getConnectionCount(): number {
    return this.connectionManager.getConnectionCount();
  }
}
