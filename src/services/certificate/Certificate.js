import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// GetCertificateApi
export const GetCertificateApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.certificate?.get_certificate;
  return ApiService.post(METHOD_URL, data);
};