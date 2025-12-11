
import { createSlice } from "@reduxjs/toolkit";
 
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    message: null,
    readData: null,
    chatUserList:null,
    unreadMessageCount: 0
  },
  reducers: {
    setMessage(state, action) {
      state.message = action.payload;
    },
    setReadStatus(state, action) {
      state.readData = action.payload;
    },
    setChatUserList(state, action) {
      state.chatUserList = action.payload;
    },
    setUnreadMessageCount(state, action) {
      state.unreadMessageCount = action.payload;
    },
  },
});
 
export const { setMessage,setReadStatus,setChatUserList,unreadMessageCount } = chatSlice.actions;
export default chatSlice.reducer;
 

 