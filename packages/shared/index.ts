// Shared types for the real-time chat application

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

// Socket event names
export const SOCKET_EVENTS = {
  SET_NAME: 'set name',
  NAME_SET: 'name set',
  CHAT_MESSAGE: 'chat message',
  USERS_LIST: 'users list',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  USER_TYPING: 'user typing',
  ERROR: 'error',
  DISCONNECT: 'disconnect'
} as const;

// Environment configuration
export const CONFIG = {
  SERVER_PORT: process.env.PORT || 3001,
  CLIENT_URL: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000'
} as const;
