export interface User {
    id: string;
    name: string;
    socketId: string;
}
export interface ChatMessage {
    userId: string;
    userMessage: string;
    userName: string;
    timestamp: Date;
}
export interface TypingEvent {
    isTyping: boolean;
    userName: string;
}
export interface ErrorResponse {
    message: string;
    details?: string;
}
export interface NameSetResponse {
    success: boolean;
    name: string;
}
export declare const SOCKET_EVENTS: {
    readonly SET_NAME: "set name";
    readonly NAME_SET: "name set";
    readonly CHAT_MESSAGE: "chat message";
    readonly USERS_LIST: "users list";
    readonly TYPING: "typing";
    readonly STOP_TYPING: "stop typing";
    readonly USER_TYPING: "user typing";
    readonly ERROR: "error";
    readonly DISCONNECT: "disconnect";
};
export declare const CONFIG: {
    readonly SERVER_PORT: string | 3001;
    readonly CLIENT_URL: "https://yourdomain.com" | "http://localhost:3000";
};
//# sourceMappingURL=index.d.ts.map