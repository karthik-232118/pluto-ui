// reducer.js
import { SET_LINKED_DATA } from "./actions";

const initialState = {
  linkedType: null,
  linkedID: null,
};

const linkedDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LINKED_DATA:
      return {
        ...state,
        linkedType: action.payload.linkedType,
        linkedID: action.payload.linkedID,
      };
    default:
      return state;
  }
};

export default linkedDataReducer; // <-- Add default export
