import { Server } from "socket.io";
import * as http from "http";

interface User {
  id: string;
  name: string;
}

interface ChatMessageData {
  message: string;
}

class SocketServer {
  private server: http.Server;
  private io: Server;
  private users: Map<string, User>;

  constructor(port: number) {
    this.server = http.createServer();
    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.users = new Map();
    this.initializeSocketHandlers();
  }

  private initializeSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      socket.on("set name", async (name: string) => {
        try {
          if (!name?.trim()) {
            throw new Error("Invalid username");
          }

          const existingUser = Array.from(this.users.values()).find(
            (user) => user.name.toLowerCase() === name.toLowerCase()
          );

          if (existingUser) {
            throw new Error("Username already taken");
          }

          this.users.set(socket.id, { id: socket.id, name });
          this.io.emit("users list", Array.from(this.users.values()));
        } catch (error) {
          socket.emit("error", {
            message: "Failed to set username",
            details: (error as Error)?.message,
          });
        }
      });

      socket.on("chat message", async (data: ChatMessageData) => {
        try {
          const user = this.users.get(socket.id);
          if (!user) {
            throw new Error("User not found");
          }

          if (!data?.message?.trim()) {
            throw new Error("Invalid message");
          }

          this.io.emit("chat message", {
            userName: user.name,
            userId: socket.id,
            userMessage: data.message,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          socket.emit("error", {
            message: "Failed to send message",
            details: (error as Error)?.message,
          });
        }
      });

      socket.on("disconnect", () => {
        this.users.delete(socket.id);
        this.io.emit("users list", Array.from(this.users.values()));
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
        socket.emit("error", {
          message: "An unexpected error occurred",
          details: "Please try again later",
        });
      });
    });
  }

  public start(): void {
    const PORT = 3001;
    this.server.listen(PORT, () => {
      console.log(`WebSocket server running on port ${PORT}`);
    });
  }
}

const socketServer = new SocketServer(3001);
socketServer.start();
