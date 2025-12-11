import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// getalluserApi
export const getalluserApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user_management?.get_all_users;
  return ApiService.post(METHOD_URL);
};

export const deleteuserApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user_management?.delete_user;
  return ApiService.post(METHOD_URL, data);
};

export const updateuserApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user_management?.update_user;
  return ApiService.post(METHOD_URL, data);
};

export const SearchUserApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user_management?.search_user;
  return ApiService.post(METHOD_URL, data);
};

// add_user

export const AddUserApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user_management?.add_user;
  return ApiService.post(METHOD_URL, data);
};




export const AddBulkUserApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user_management?.bluck_user_upload;
  return ApiService.post(METHOD_URL, data);
};

