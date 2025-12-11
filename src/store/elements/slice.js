import { createSlice } from "@reduxjs/toolkit";
import {
  GetElementsCategory,
  GetElementsFolderDocument,
  GetElementsFolderFile,
  GetElementsSidebar,
  GetChatsList,
  GetContactList,
} from "./action";

const initialState = {
  elementsFolderFiles: {},
  elementsCategoryFiles: {},
  elementsDocumentFiles: {},
  elementsSidebar: {},
  
  loading: true,
  error: null,
  get_AllChats: [],
  allContacts: [],
};

const elementsSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Category files list
    builder.addCase(GetElementsCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetElementsCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.elementsCategoryFiles = action.payload;
    });
    builder.addCase(GetElementsCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    // Folder files list
    builder.addCase(GetElementsFolderFile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetElementsFolderFile.fulfilled, (state, action) => {
      state.loading = false;
      state.elementsFolderFiles = action.payload;
    });
    builder.addCase(GetElementsFolderFile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    // Folder document details
    builder.addCase(GetElementsFolderDocument.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetElementsFolderDocument.fulfilled, (state, action) => {
      // console.log("GetElementsFolderDocument fulfilled:", action.payload);
      state.loading = false;
      state.elementsDocumentFiles = action.payload; // Store document details
    });
    builder.addCase(GetElementsFolderDocument.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    // Sidebar data
    builder.addCase(GetElementsSidebar.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetElementsSidebar.fulfilled, (state, action) => {
      state.loading = false;
      state.elementsSidebar = action.payload; // Store sidebar data separately
    });
    builder.addCase(GetElementsSidebar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    // Get all chats
    builder.addCase(GetChatsList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetChatsList.fulfilled, (state, action) => {
      state.loading = false;
      state.get_AllChats = action.payload;
    });
    builder.addCase(GetChatsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
    // Add more reducers here
    builder.addCase(GetContactList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetContactList.fulfilled, (state, action) => {
      state.loading = false;
      state.allContacts = action.payload;
    });
    builder.addCase(GetContactList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export default elementsSlice.reducer;
