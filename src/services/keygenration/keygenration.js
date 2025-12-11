import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// Add dipartment
export const keygenrerationApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.keygenreration.create;
  return ApiService.post(METHOD_URL, data);
};
