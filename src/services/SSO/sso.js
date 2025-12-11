import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


//get sso link

export const getSSOLinkAPI = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.SSO?.get_sso_link;
  return ApiService.post(METHOD_URL, data);
};

// get_sso_details

export const getSSODetailsAPI = (data) => {
    const METHOD_URL =
      BASE_URL + ENDPOINT_URL?.SSO?.get_sso_details;
    return ApiService.post(METHOD_URL, data);
  };