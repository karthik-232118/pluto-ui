import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";



// upload_size
export const SettingsUploadSize = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.Settings?.upload_size;
  return ApiService.post(METHOD_URL, data);
};

// get_system_settings
export const GetSystemSettings = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.Settings?.get_system_settings;
  return ApiService.post(METHOD_URL, data);
};