import { validateConfig } from "./config";
import { UseWebSocketServer } from "./core/use-websocket-server";
import { UseGracefulShutdown } from "./utils/use-graceful-shutdown";
import { UseConnectionManager } from "./core/use-connection-manager";
import { UseMessageHandler } from "./handlers/use-message-handler";
import { UseMessageBroadcaster } from "./services/use-message-broadcaster";

validateConfig();

const serverManager = new UseWebSocketServer();

new UseGracefulShutdown(serverManager);

serverManager.start();

export {
  UseWebSocketServer,
  UseConnectionManager,
  UseMessageHandler,
  UseMessageBroadcaster,
  UseGracefulShutdown,
};
export { SERVER_CONFIG } from "./config";
