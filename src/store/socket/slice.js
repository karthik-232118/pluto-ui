// socketSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { BASE_URL } from "../../config/urlConfig";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    instance: null,
  },
  reducers: {
    setSocket(state, action) {
      state.instance = action.payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;

export const initializeSocket = () => (dispatch) => {
  const socket = io(new URL(BASE_URL).origin, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 10000,
  });
  dispatch(setSocket(socket));
  return socket;
};
