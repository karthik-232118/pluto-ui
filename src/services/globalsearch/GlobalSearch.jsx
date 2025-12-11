import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const GlobalSearchApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.global_search?.main_search;
  return ApiService.post(METHOD_URL, data);
};