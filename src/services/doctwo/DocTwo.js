import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";
// DocTwoAPI
export const DocTwoAPI = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.documenttwo?.document_two;
  return ApiService.post(METHOD_URL, data);
};
