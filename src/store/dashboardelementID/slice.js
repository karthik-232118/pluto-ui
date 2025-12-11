// reducer.js
import { SET_ELEMENT_ID } from './actions';

const initialState = {
  elementID: null,
  moduleName: null, // Add moduleName to the initial state
};

const dashboardElementIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ELEMENT_ID:
      return {
        ...state,
        elementID: action.payload.elementID,
        moduleName: action.payload.moduleName, // Store the ModuleName
      };
    default:
      return state;
  }
};

export default dashboardElementIdReducer;
