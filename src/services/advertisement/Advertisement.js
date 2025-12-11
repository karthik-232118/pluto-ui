import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

// AttemptsApi

export const GetAdvertisementApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.advertisements?.get_advertisement;
  return ApiService.post(METHOD_URL, data);
};
export const AddAdvertisementApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.advertisements?.add_advertisement;
  return FileUploadService.post(METHOD_URL, data);
};

export const EditAdvertisementApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.advertisements?.edit_advertisement;
  return FileUploadService.post(METHOD_URL, data);
};


export const deleteAdvertisementApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.advertisements?.delete_advertisement;
  return ApiService.post(METHOD_URL, data);
};

