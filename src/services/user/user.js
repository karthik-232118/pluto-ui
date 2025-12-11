import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

export const getuserdataApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user.get_user_details;
  return ApiService.post(METHOD_URL);
};

export const updateuserdataApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user.update_user_details;
  return FileUploadService.post(METHOD_URL, data);
};

export const ChangePaswdataApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user.change_psw;
  return ApiService.post(METHOD_URL, data);
};

export const UpdateNotificationApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.user.updateNotifaction;
  return ApiService.post(METHOD_URL, data);
};
