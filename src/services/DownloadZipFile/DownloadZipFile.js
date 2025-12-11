// download_zip_document


import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";
// DownloadZipDocApi
export const DownloadZipDocApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.DownloadZIPDocument?.download_zip_document;
  return ApiService.post(METHOD_URL, data, { responseType: "blob" });
};


