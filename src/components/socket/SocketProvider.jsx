import  { createContext, useContext } from "react";
import { getSocket } from "./Socket";
import PropTypes from "prop-types";


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = getSocket();
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};


SocketProvider.propTypes = {
  children: PropTypes.node.isRequired, // Children components that will use the socket context
};
