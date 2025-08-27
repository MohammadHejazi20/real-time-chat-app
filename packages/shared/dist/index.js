"use strict";
// Shared types for the real-time chat application
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = exports.SOCKET_EVENTS = void 0;
// Socket event names
exports.SOCKET_EVENTS = {
    SET_NAME: 'set name',
    NAME_SET: 'name set',
    CHAT_MESSAGE: 'chat message',
    USERS_LIST: 'users list',
    TYPING: 'typing',
    STOP_TYPING: 'stop typing',
    USER_TYPING: 'user typing',
    ERROR: 'error',
    DISCONNECT: 'disconnect'
};
// Environment configuration
exports.CONFIG = {
    SERVER_PORT: process.env.PORT || 3001,
    CLIENT_URL: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'
        : 'http://localhost:3000'
};
//# sourceMappingURL=index.js.map