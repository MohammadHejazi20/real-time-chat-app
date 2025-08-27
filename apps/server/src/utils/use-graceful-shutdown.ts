import { UseWebSocketServer } from "../core/use-websocket-server";

export class UseGracefulShutdown {
  constructor(private serverManager: UseWebSocketServer) {
    this.setupSignalHandlers();
  }

  private setupSignalHandlers(): void {
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      this.serverManager.stop();
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      this.serverManager.stop();
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      this.serverManager.stop();
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      this.serverManager.stop();
    });
  }
}
