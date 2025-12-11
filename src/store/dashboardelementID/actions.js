// actions.js
export const SET_ELEMENT_ID = 'SET_ELEMENT_ID';

export const setElementID = (elementID, moduleName) => {
  return {
    type: SET_ELEMENT_ID,
    payload: {
      elementID,
      moduleName, // Pass the ModuleName to the payload
    },
  };
};
