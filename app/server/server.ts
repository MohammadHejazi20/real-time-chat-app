const http = require("http");
const { Server } = require("socket.io");

interface User {
  id: string;
  name: string;
}

const server = http.createServer(
  (
    _req: any,
    res: {
      writeHead: (arg0: number, arg1: { "Content-Type": string }) => void;
      end: (arg0: string) => void;
    }
  ) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running");
  }
);

const io = new Server(server, {
  // solve FUCKING CORS issue
  cors: {
    origin: "http://localhost:3000", // Match your client URL and port
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users: User[] = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("set name", (name) => {
    users.push({ id: socket.id, name });
    io.emit("users list", users); // Broadcast the updated list of users
  });

  socket.on("chat message", (data) => {
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      io.emit("chat message", {
        userName: user.name,
        userId: socket.id,
        userMessage: data.message,
      }); // Broadcast the message with user's ID
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Remove the user from the list
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
    }
    io.emit("users list", users); // Broadcast the updated list of users
  });
});

const PORT = 3001; // Ensure the correct port number
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
