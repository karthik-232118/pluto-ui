// downloadReducer.js
import { SET_DOWNLOAD_FUNCTION } from "./downloadActions";

const initialState = {
  downloadPDF: null,
};

const downloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DOWNLOAD_FUNCTION:
      return { ...state, downloadPDF: action.payload };
    default:
      return state;
  }
};

export default downloadReducer;
