  import io from "socket.io-client";
  import { BASE_URL } from "../../config/urlConfig";

  const user_id = localStorage.getItem("user_id");

  // Initialize socket connection (we set autoConnect to false to have more control over when to connect)
  export const socketIo = io(new URL(BASE_URL).origin, {
    reconnection: true,
    reconnectionAttempts: 10, // Max number of reconnection attempts
    reconnectionDelay: 2000, // Delay between reconnection attempts (in ms)
    timeout: 10000, // Connection timeout (in ms)
  });

  // Listen for the connection event
  socketIo.on("connect", () => {
    console.log("Connected to socket server.");
    if (user_id) {
      socketIo.emit("register", user_id);
      console.log(`User ${user_id} registered.`);
    }
  });

  // Listen for connection errors
  socketIo.on("connect_error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

  // Listen for disconnections
  socketIo.on("disconnect", () => {
    console.log("Disconnected from socket server.");
  });

  // Optional: Listen for reconnections
  socketIo.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected to server after ${attemptNumber} attempts.`);
  });

  // Optionally, listen to other events that may be relevant (e.g., messages)
  socketIo.on("chat_message", (payload) => {
    console.log("Chat message received:", payload);
    // Handle the chat message (e.g., update state/UI here)
  });

  // Function to manually connect to the socket (use this in your component lifecycle or whenever required)
  export const connectSocket = () => {
    if (!socketIo.connected) {
      socketIo.connect();  // Manually connect the socket when needed
    }
  };

  // Clean up socket event listeners (for specific events)
  export const SOCKET_DISCONNECT_ORDER_INFO = () => {
    socketIo.off("chat_message");  // Remove the specific listener for chat messages
    // Add more event cleanup if necessary
    console.log("Cleaned up chat message listener.");
  };

  // Emit the "chat_message" event (you can pass any payload to this)
  export const SOCKET_GET_MEMBER_CHAT = () => {
    console.log("Sent chat message:");

    if (socketIo.connected) {
      console.log("Sent chat message:");
    } else {
      console.log("Socket is not connected, cannot send message.");
    }
  };


  // Export the socket instance for use elsewhere in your app
  export const SOCKET_CONNECTER_IO = () => {
    return socketIo;
  };
