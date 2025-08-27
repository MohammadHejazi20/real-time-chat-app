const WebSocket = require("ws");

// Test WebSocket connection
const ws = new WebSocket("ws://localhost:3001/ws");

ws.on("open", function open() {
  console.log("✅ Connected to WebSocket server");

  // Test setting name
  console.log("📝 Testing SET_NAME...");
  ws.send(
    JSON.stringify({
      type: "set name",
      data: { name: "TestUser" },
      timestamp: Date.now(),
    })
  );
});

ws.on("message", function message(data) {
  const msg = JSON.parse(data);
  console.log("📨 Received:", msg.type, msg.data);

  if (msg.type === "name set" && msg.data.success) {
    console.log("✅ Name set successfully!");

    // Test sending a message
    console.log("💬 Testing CHAT_MESSAGE...");
    ws.send(
      JSON.stringify({
        type: "chat message",
        data: { id: "1", message: "Hello, World!" },
        timestamp: Date.now(),
      })
    );
  }

  if (msg.type === "chat message") {
    console.log("✅ Message sent successfully!");

    // Test typing indicator
    console.log("⌨️ Testing TYPING...");
    ws.send(
      JSON.stringify({
        type: "typing",
        data: { isTyping: true },
        timestamp: Date.now(),
      })
    );

    // Stop typing after 2 seconds
    setTimeout(() => {
      console.log("⏹️ Testing STOP_TYPING...");
      ws.send(
        JSON.stringify({
          type: "stop typing",
          data: { isTyping: false },
          timestamp: Date.now(),
        })
      );

      // Close connection after testing
      setTimeout(() => {
        console.log("🔌 Closing connection...");
        ws.close();
      }, 1000);
    }, 2000);
  }
});

ws.on("error", function error(err) {
  console.error("❌ WebSocket error:", err);
});

ws.on("close", function close() {
  console.log("🔌 Connection closed");
  process.exit(0);
});
