// socket.js
import { io } from "socket.io-client"; // Import the Socket.IO client library
import { BASE_URL } from "../../config/urlConfig"; // Import server base URL from config

// Initialize socket variable as null to use singleton pattern
let socket = null;

/**
 * Returns a socket.io connection instance.
 * Creates a new connection if one doesn't already exist (singleton pattern).
 * 
 * @returns {Socket} The socket.io connection instance
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(new URL(BASE_URL).origin, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
    });
    console.log("Socket initialized");
  }
  return socket;
};
