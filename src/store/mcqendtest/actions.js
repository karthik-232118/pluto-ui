export const GET_END_TEST_SUCCESS = "GET_END_TEST_SUCCESS";

export const GetEndTest = (payload) => async (dispatch) => {
  try {
    const response = await apiCallToEndTest(payload); // Your API call
    dispatch({
      type: GET_END_TEST_SUCCESS,
      payload: response.data, // Store response data
    });
    return response;
  } catch (error) {
    console.error("Error ending the test:", error);
  }
};
