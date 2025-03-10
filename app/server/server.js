var http = require("http");
var Server = require("socket.io").Server;
var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running");
});
var io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Match your client URL and port
        methods: ["GET", "POST"],
        credentials: true,
    },
});
var users = [];
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("set name", function (name) {
        users.push({ id: socket.id, name: name });
        io.emit("users list", users); // Broadcast the updated list of users
    });
    socket.on("chat message", function (data) {
        var user = users.find(function (user) { return user.id === socket.id; });
        if (user) {
            io.emit("chat message", {
                userName: user.name,
                userId: socket.id,
                userMessage: data.message,
            }); // Broadcast the message with user's ID
        }
    });
    socket.on("disconnect", function () {
        console.log("A user disconnected");
        // Remove the user from the list
        var index = users.findIndex(function (user) { return user.id === socket.id; });
        if (index !== -1) {
            users.splice(index, 1);
        }
        io.emit("users list", users); // Broadcast the updated list of users
    });
});
var PORT = 3001; // Ensure the correct port number
server.listen(PORT, function () {
    console.log("WebSocket server listening on port ".concat(PORT));
});
