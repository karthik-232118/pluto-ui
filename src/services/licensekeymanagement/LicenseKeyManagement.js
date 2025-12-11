import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// get_license_details
export const fetchLicenseKeyDetails = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.licensekeymanagement?.get_license_details;
  return ApiService.post(METHOD_URL, data);
};

// add_license_key

export const addLicenseKey = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.licensekeymanagement?.add_license_key;
  return ApiService.post(METHOD_URL, data);
};