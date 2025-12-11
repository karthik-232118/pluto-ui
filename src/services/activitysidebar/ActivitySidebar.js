import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// ActivitySidebar
export const ActivitySidebarApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.rightSideBar?.activity_comment;
  return ApiService.post(METHOD_URL, data);
};

// activity_addcomment

export const ActivityAddCommentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.rightSideBar?.activity_addcomment;
  return ApiService.post(METHOD_URL, data);
};

//Delegate User
export const DelegateUser = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.rightSideBar?.activity_delegate;
  return ApiService.post(METHOD_URL, data);
};

//update status
export const delegateStatusUpdate = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.rightSideBar?.activity_updated_elegate;
  return ApiService.post(METHOD_URL, data);
};

// activity_view_history

export const ActivityViewHistoryApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.rightSideBar?.activity_view_history;
  return ApiService.post(METHOD_URL, data);
}