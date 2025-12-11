import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const hideUnhideModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements_folder?.hideUnhideModule;
  return ApiService.post(METHOD_URL, data);
};
