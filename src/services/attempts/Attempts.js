import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// AttemptsApi

export const AttemptsApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.attempts?.ts_attempts;
  return ApiService.post(METHOD_URL, data);
};