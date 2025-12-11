import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const MyRequestApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.myreq?.my_request;
  return ApiService.post(METHOD_URL, data);
};

export const AddNewReqApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.myreq?.add_request;
  return ApiService.post(METHOD_URL, data);
};

export const EditReqApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.myreq?.edit_request;
  return ApiService.post(METHOD_URL, data);
};

export const DeleteReqApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.myreq?.delete_request;
  return ApiService.post(METHOD_URL, data);
};
