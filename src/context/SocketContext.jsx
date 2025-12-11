import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../config/urlConfig";
import PropTypes from "prop-types";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("🔌 Connecting socket...", window.location.origin);

      const newSocket = io(BASE_URL, {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 10000,
      });

      console.log("🔌Connected socket...", newSocket);

      socketRef.current = newSocket;

      setSocket(socketRef.current);

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current.id);
        const userId = localStorage.getItem("user_id");
        console.log("🔌 Checking user ID for socket connection:", userId);

        if (userId) {
          console.log("Registering user with id:", userId);
          socketRef.current.emit("register", userId);
        }
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected, attempting to reconnect...");
      });
    }

    return () => {
      console.log("🛑 Application unmounted. Cleaning up socket...");
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
