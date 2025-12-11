import { createSlice } from "@reduxjs/toolkit";
import { GetNotesList, GetAddNote, GetUpdateNote } from "./action"; // Import GetUpdateNote

const notesSlice = createSlice({
  name: "noteslist",
  initialState: {
    noteslist: [], // Holds the list of notes
    addNoteResponse: null, // Stores Add Note response
    updateNoteResponse: null, // Stores Update Note response
    loading: false, // Tracks loading state
    error: null, // Tracks any errors
  },
  reducers: {
    clear: (state) => {
      state.noteslist = []; // Clear the notes list
      state.addNoteResponse = null; // Clear the add note response
      state.updateNoteResponse = null; // Clear the update note response
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notes List
      .addCase(GetNotesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetNotesList.fulfilled, (state, action) => {
        state.loading = false;
        state.noteslist = action.payload;
      })
      .addCase(GetNotesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // Add Note
      .addCase(GetAddNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAddNote.fulfilled, (state, action) => {
        state.loading = false;
        state.addNoteResponse = action.payload; // Store Add Note response
      })
      .addCase(GetAddNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // Update Note
      .addCase(GetUpdateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUpdateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.updateNoteResponse = action.payload; // Store Update Note response
      })
      .addCase(GetUpdateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clear } = notesSlice.actions;
export default notesSlice.reducer;
