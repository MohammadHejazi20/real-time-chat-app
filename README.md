# Real-Time Chat App - Monorepo

A modern, real-time chat application built with Next.js, WebSocket (ws), and shadcn/ui components, organized as a monorepo for better scalability and maintainability.

## 🏗️ Monorepo Structure

```
real-time-chat-app/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   └── public/            # Static assets
│   └── server/                # WebSocket backend server
│       ├── src/               # TypeScript source code
│       └── dist/              # Compiled JavaScript (generated)
├── packages/
│   └── shared/                # Shared types and utilities
│       └── src/               # TypeScript source code
├── package.json                # Root workspace configuration
└── pnpm-workspace.yaml        # pnpm workspace configuration
```

## ✨ Features

- **Real-time messaging** using native WebSocket (ws)
- **Modern UI** built with shadcn/ui components
- **Responsive design** with Tailwind CSS
- **User presence** indicators
- **Typing indicators** when users are composing messages
- **Message timestamps** and user avatars
- **Dark mode support** with CSS variables
- **Interactive components** with tooltips and hover cards
- **Monorepo architecture** for better code organization
- **Shared types** between frontend and backend
- **TypeScript** throughout the entire stack
- **Lightweight WebSocket server** without Express dependencies
- **Connection management** with heartbeat and graceful shutdown

## 🛠️ Tech Stack

### Frontend (apps/web)

- **Framework**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables
- **Real-time**: Native WebSocket API with custom hook
- **Icons**: Lucide React

### Backend (apps/server)

- **Runtime**: Node.js with TypeScript
- **WebSocket**: ws library (lightweight WebSocket server)
- **Real-time**: Native WebSocket implementation
- **Configuration**: Environment-based configuration
- **Connection Management**: Heartbeat, graceful shutdown
- **No Express**: Pure WebSocket server for minimal overhead

### Shared (packages/shared)

- **Types**: Common interfaces and types
- **Constants**: WebSocket event names and configuration
- **Utilities**: Shared functions and helpers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### 1. Quick Setup

```bash
# Install dependencies and build shared package
pnpm setup
```

### 2. Manual Setup (Alternative)

```bash
# Install all dependencies
pnpm install

# Build the shared types package
pnpm shared:build
```

### 3. Start Development Servers

#### Option A: Start All Services

```bash
# Start both web and server in parallel
pnpm dev
```

#### Option B: Start Services Individually

```bash
# Terminal 1: Start the web app
pnpm web:dev

# Terminal 2: Start the server
pnpm server:dev
```

### 4. Access the Application

- **Frontend**: <http://localhost:3000>
- **WebSocket**: ws://localhost:3001/ws

## 📦 Available Scripts

### Root Level

```bash
pnpm setup          # Install deps and build shared package
pnpm dev            # Start all services in parallel
pnpm build          # Build all packages
pnpm start          # Start all services in production
pnpm lint           # Lint all packages
pnpm clean          # Clean all build artifacts
```

### Web App (apps/web)

```bash
pnpm web:dev        # Start web development server
pnpm web:build      # Build web application
pnpm web:start      # Start web production server
pnpm web:lint       # Lint web application
pnpm web:clean      # Clean web build artifacts
```

### Server App (apps/server)

```bash
pnpm server:dev     # Start server in development mode
pnpm server:build   # Build server application
pnpm server:start   # Start server in production mode
pnpm server:lint    # Lint server application
pnpm server:clean   # Clean server build artifacts
```

### Shared Package (packages/shared)

```bash
pnpm shared:build   # Build shared package
pnpm --filter=@real-time-chat-app/shared dev     # Watch mode
pnpm --filter=@real-time-chat-app/shared clean   # Clean shared package
```

## 🔧 Development Workflow

### 1. Making Changes to Shared Types

```bash
# 1. Update types in packages/shared/src/
# 2. Build the shared package
pnpm shared:build
# 3. Restart dependent services to pick up changes
```

### 2. Adding New Dependencies

```bash
# Add to specific app
pnpm --filter=@real-time-chat-app/web add package-name
pnpm --filter=./apps/server add package-name

# Add to shared package
pnpm --filter=@real-time-chat-app/shared add package-name
```

### 3. Running Tests (when implemented)

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
pnpm --filter=./apps/web test
```

## 🌐 WebSocket Events

The application uses standardized event names defined in the shared package:

- `set name` - Set user display name
- `name set` - Confirm name was set successfully
- `chat message` - Send/receive chat messages
- `users list` - Update active users list
- `typing` - User started typing
- `stop typing` - User stopped typing
- `user typing` - Broadcast typing status
- `error` - Error handling

## 📁 Key Components

### Core Components (apps/web)

- `JoinCard` - User authentication and room entry
- `MessageBubble` - Individual chat message display
- `TypingIndicator` - Shows when users are typing
- `Show` - Conditional rendering utility
- `useWebSocket` - Custom hook for WebSocket communication

### UI Components (shadcn/ui)

- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Button` with various variants
- `Input` and `Textarea` for user input
- `Avatar` for user representation
- `Badge` for status indicators
- `ScrollArea` for scrollable content
- `Tooltip` and `HoverCard` for enhanced UX
- `Separator` for visual separation

## 🔒 Environment Variables

### Server (apps/server/env.example)

```bash
# Copy env.example to .env and configure
PORT=3001                    # Server port (default: 3001)
NODE_ENV=development         # Environment mode
HOST=localhost               # Server host
WS_PATH=/ws                  # WebSocket path
MAX_CONNECTIONS=1000         # Maximum concurrent connections
HEARTBEAT_INTERVAL=30000     # Heartbeat interval in ms
```

### Web (.env.local in apps/web/)

```bash
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws  # WebSocket server URL
```

## 🚀 Production Deployment

### 1. Build All Packages

```bash
pnpm build
```

### 2. Start Production Services

```bash
# Start server
pnpm server:start

# Start web app
pnpm web:start
```

### 3. Environment Configuration

Update the server configuration in `apps/server/src/config.ts` for production domains.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Build shared package**: `pnpm shared:build`
5. **Test your changes**
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

## 📝 License

MIT License

## 🆘 Troubleshooting

### Common Issues

1. **Module not found errors**: Make sure to build the shared package first with `pnpm shared:build`
2. **Port conflicts**: Check if ports 3000 or 3001 are already in use
3. **Type errors**: Ensure TypeScript is properly configured in each package
4. **Dependency issues**: Try cleaning and reinstalling: `pnpm clean && pnpm install`
5. **WebSocket connection issues**: Verify the server is running and the WebSocket path is correct

### Getting Help

- Check the console for error messages
- Verify all services are running
- Ensure the shared package is built
- Check network connectivity between services
- Verify WebSocket URL configuration

## 🔄 Migration from Socket.IO

This project has been migrated from Socket.IO to native WebSocket for:

- **Better performance**: Lower overhead without Socket.IO wrapper
- **Smaller bundle size**: No additional client library
- **Native support**: Better browser compatibility
- **Custom control**: Full control over WebSocket implementation
