# Real-Time Chat App - Turborepo

A modern, real-time chat application built with Next.js, WebSocket (ws), and shadcn/ui components, organized as a Turborepo monorepo for better scalability and maintainability.

## 🏗️ Turborepo Structure

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
│   ├── shared/                # Shared types and utilities
│   ├── ui/                    # Shared UI components
│   ├── eslint-config/         # Shared ESLint configurations
│   └── typescript-config/     # Shared TypeScript configurations
├── package.json                # Root workspace configuration
├── pnpm-workspace.yaml        # pnpm workspace configuration
└── turbo.json                 # Turborepo configuration
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
- **Turborepo monorepo** architecture for better code organization and caching
- **Shared packages** with types, UI components, and configurations
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
- **Build Tool**: tsdown for fast TypeScript compilation
- **Real-time**: Native WebSocket implementation
- **Configuration**: Environment-based configuration
- **Connection Management**: Heartbeat, graceful shutdown
- **No Express**: Pure WebSocket server for minimal overhead

### Shared Packages

- **shared**: Common interfaces, types, and WebSocket event constants
- **ui**: Reusable UI components built with React and TypeScript
- **eslint-config**: Shared ESLint configurations for consistent code style
- **typescript-config**: Shared TypeScript configurations

### Build System

- **Turborepo**: High-performance build system with intelligent caching
- **pnpm**: Fast, disk space efficient package manager
- **Parallel Builds**: Build and development tasks run in parallel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### 1. Install Dependencies

```bash
# Install all dependencies using Turborepo
pnpm install
```

### 2. Start Development Servers

#### Option A: Start All Services (Recommended)

```bash
# Start both web and server using Turborepo
pnpm dev
```

#### Option B: Start Services Individually

```bash
# Terminal 1: Start the web app (runs on port 3002 with Turbopack)
cd apps/web && pnpm dev

# Terminal 2: Start the server
cd apps/server && pnpm dev
```

### 3. Access the Application

- **Frontend**: <http://localhost:3002>
- **WebSocket**: ws://localhost:3001/ws

## 📦 Available Scripts

### Root Level (Turborepo)

```bash
pnpm dev            # Start all services in parallel with caching
pnpm build          # Build all packages with dependency graph optimization
pnpm lint           # Lint all packages in parallel
pnpm format         # Format code using Prettier
pnpm check-types    # Type check all packages
```

### Web App (apps/web)

```bash
cd apps/web
pnpm dev            # Start with Next.js + Turbopack (port 3002)
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Lint web application
pnpm check-types    # Type check web app
pnpm clean          # Clean build artifacts
```

### Server App (apps/server)

```bash
cd apps/server
pnpm dev            # Start with tsx watch mode
pnpm build          # Build with tsdown
pnpm start          # Start production server
pnpm clean          # Clean build artifacts
pnpm test-ws        # Test WebSocket connection
```

### Package Scripts

```bash
# UI Package
cd packages/ui
pnpm lint           # Lint UI components
pnpm check-types    # Type check UI package
pnpm generate:component  # Generate new React component

# ESLint Config
cd packages/eslint-config
# Configuration only - no build scripts needed

# TypeScript Config  
cd packages/typescript-config
# Configuration only - no build scripts needed
```

## 🔧 Development Workflow

### 1. Adding New Dependencies

```bash
# Add to specific app
pnpm --filter=web add package-name
pnpm --filter=server add package-name

# Add to shared packages
pnpm --filter=@repo/ui add package-name
pnpm --filter=@real-time-chat-app/shared add package-name
```

### 2. Creating New Components

```bash
# Generate new UI component
cd packages/ui
pnpm generate:component
```

### 3. Working with Turborepo

```bash
# Build only specific package and its dependencies
pnpm build --filter=web

# Run dev for specific package
pnpm dev --filter=server

# Clear Turborepo cache
pnpm turbo daemon stop
```

### 4. Running Tests (when implemented)

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
pnpm --filter=server test
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
cd apps/server && pnpm start

# Start web app  
cd apps/web && pnpm start
```

### 3. Environment Configuration

Update the server configuration in `apps/server/src/config.ts` for production domains.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test your changes**: `pnpm dev` to ensure everything works
5. **Lint and type check**: `pnpm lint && pnpm check-types`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

## 📝 License

MIT License

## 🆘 Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure all packages are installed with `pnpm install`
2. **Port conflicts**: Web app runs on 3002, server on 3001 - check if ports are available
3. **Type errors**: Run `pnpm check-types` to identify issues across packages
4. **Build errors**: Try cleaning first: `rm -rf .turbo && pnpm build`
5. **Cache issues**: Clear Turborepo cache: `pnpm turbo daemon stop`
6. **WebSocket connection issues**: Verify server is running and WebSocket path is correct

### Turborepo-Specific Issues

1. **Task not found**: Check `turbo.json` for available tasks
2. **Dependency issues**: Ensure proper `dependsOn` configuration in `turbo.json`
3. **Cache misses**: Verify `inputs` and `outputs` are correctly configured

### Getting Help

- Check the console for error messages
- Verify all services are running with `pnpm dev`
- Check network connectivity between services
- Verify WebSocket URL configuration matches server settings

## 🔄 Migration Notes

This project has evolved from a basic monorepo to a Turborepo-powered workspace:

### Key Improvements

- **Turborepo Integration**: Added intelligent build caching and task orchestration
- **Shared Packages**: Extracted common configurations (ESLint, TypeScript) and UI components
- **Better DX**: Faster builds, better type checking, and improved development workflow
- **Native WebSocket**: Continues to use native WebSocket instead of Socket.IO for better performance

### From Socket.IO to Native WebSocket

- **Better performance**: Lower overhead without Socket.IO wrapper  
- **Smaller bundle size**: No additional client library
- **Native support**: Better browser compatibility
- **Custom control**: Full control over WebSocket implementation
