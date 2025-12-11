import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// mcq_list
export const McqCreationListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.mcq_creations?.mcq_list;
  return ApiService.post(METHOD_URL, data);
};

// add_mcq

export const McqAddApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.mcq_creations?.add_mcq;
  return ApiService.post(METHOD_URL, data);
};

// delete_mcq

export const DeleteMcqApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.mcq_creations?.delete_mcq;
  return ApiService.post(METHOD_URL, data);
};

//  update_mcq

export const UpdateMcqApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.mcq_creations?.update_mcq;
  return ApiService.post(METHOD_URL, data);
};