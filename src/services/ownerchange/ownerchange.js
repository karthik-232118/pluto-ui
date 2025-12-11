import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// save_owner_change

export const SaveOwnerChangeApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.save_owner_change;
  return ApiService.post(METHOD_URL, data);
};

// auditor_list
export const AuditorListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.auditor_list;
  return ApiService.post(METHOD_URL, { params: data });
};
// signatory_list

export const SignatoryListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.signatory_list;
  return ApiService.post(METHOD_URL, { params: data });
}

// get_signatory_user_list
export const GetSignatoryUserListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.get_signatory_user_list;
  return ApiService.post(METHOD_URL, data);
}

// change_signatory
export const ChangeSignatoryApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.change_signatory;
  return ApiService.post(METHOD_URL, data);
}

// co_creation_list
export const CoCreatorListApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.co_creation_list;
  return ApiService.post(METHOD_URL);
 }
 
//  get_co_creation_user_list
export const GetCoCreationUserListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.get_co_creation_user_list;
  return ApiService.post(METHOD_URL, data);
}

// save_co_creation

export const SaveCoCreationApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.ownerChange?.save_co_creation;
  return ApiService.post(METHOD_URL, data);
}