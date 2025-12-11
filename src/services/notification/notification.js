import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


export const NotificationApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.notification?.notification_list;
  return ApiService.post(METHOD_URL, data);
};

export const NotificationCountApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.notification?.notification_count;
  return ApiService.post(METHOD_URL, data);
};

export const GetCountUnreadApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.notification?.get_count_unread;
  return ApiService.post(METHOD_URL, data);
};

