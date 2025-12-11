import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";
// DeleteCategoryApi
export const DeleteCategoryApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.DeleteElements?.delete_element;
  return ApiService.post(METHOD_URL, data);
};
