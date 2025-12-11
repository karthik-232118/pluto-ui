import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const listUserToAssignElement = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.list_user_to_assign_element;
  return ApiService.post(METHOD_URL, data);
};

export const listDepartment = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAssignment?.list_department;
  return ApiService.post(METHOD_URL, data);
};

export const listRole = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elementAssignment?.list_role;
  return ApiService.post(METHOD_URL, data);
};

export const assignElement = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elementAssignment?.assign_element;
  return ApiService.post(METHOD_URL, data);
};

export const fetchAssignedDataForElement = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAssignment?.fetch_assigned_data_for_element;
  return ApiService.post(METHOD_URL, data);
};

export const revokeAssignedUserFromElement = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.elementAssignment?.revoke_assigned_user_from_element;
  return ApiService.post(METHOD_URL, data);
};

export const CategoryAssign=(data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elementAssignment?.assing_category;
  return ApiService.post(METHOD_URL, data);
}