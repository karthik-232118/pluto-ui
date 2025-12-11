import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";






// CreateGroupManagementApi
export const CreateGroupManagementApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.group_management?.create_group;
  return ApiService.post(METHOD_URL, data);
};

// list_group
export const listGroupApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.group_management?.list_group;
  return ApiService.post(METHOD_URL, data);
};

// update_group

export const updateGroupApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.group_management?.update_group_single;
  return ApiService.post(METHOD_URL, data);
}

// delete_group_single

export const deleteGroupApi = (data) => {   
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.group_management?.delete_group_single;
    return ApiService.post(METHOD_URL, data);
    };

    // add_only_user
export const addOnlyUserApi = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.group_management?.add_only_user;
    return ApiService.post(METHOD_URL, data);
    };

    // remove_only_user
export const removeOnlyUserApi = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.group_management?.remove_only_user;
    return ApiService.post(METHOD_URL, data);
    }
    