// // features/attachmentsSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const attachmentsSlice = createSlice({
//   name: "attachments",
//   initialState: {
//     selectedLinks: {},
//     selectedNode: [],
//   },
//   reducers: {
//     setSelectedLinks(state, action) {
//       const { id, value } = action.payload;
//       const allData = state.selectedLinks;
//       allData[id] = value;
//       state.selectedLinks = allData;
//     },
//     updateConfigNode: (state, action) => {
//       state.selectedNode = action.payload;
//     },
//   },
// });

// export const { setSelectedLinks, updateConfigNode } = attachmentsSlice.actions;
// export default attachmentsSlice.reducer;
