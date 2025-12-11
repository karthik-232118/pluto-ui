import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";
// DocOneAPI
export const DocOneAPI = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.documentone?.document_one;
  return ApiService.post(METHOD_URL, data);
};
