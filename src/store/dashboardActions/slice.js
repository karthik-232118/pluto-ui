import { SET_DASHBOARD_DATA, SET_SELECTED_TITLE } from "./actions";


const initialState = {
  elementStatus: null,
  pendingAcknowledge: null,
  selectedTitle: ""
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_DATA:
      return {
        ...state,
        elementStatus: action.payload.elementStatus,
        pendingAcknowledge: action.payload.pendingAcknowledge
      };
    case SET_SELECTED_TITLE:
      return {
        ...state,
        selectedTitle: action.payload
      };
    default:
      return state;
  }
};

export default dashboardReducer;