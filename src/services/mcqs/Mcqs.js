import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// MCQ Questions API
export const TestMcqsListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.mcqs?.questions_list;
  return ApiService.post(METHOD_URL, data);
};

//End Test API 
export const EndTestApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.mcqs?.end_test;
  return ApiService.post(METHOD_URL, data);
};
