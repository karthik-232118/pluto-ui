import { GET_END_TEST_SUCCESS } from "./actions";

const initialState = {
  endTestResult: null,
};

export const mcqEndTestReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_END_TEST_SUCCESS:
      return {
        ...state,
        endTestResult: action.payload, // Save the end test result
      };
    default:
      return state;
  }
};

export default mcqEndTestReducer;
