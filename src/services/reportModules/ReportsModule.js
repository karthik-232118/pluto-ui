import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const testSimulationAccessList = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.reports?.test_simulation_access_list;
  return ApiService.post(METHOD_URL, data);
};
export const userAuthLogs = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.user_auth_logs;
  return ApiService.post(METHOD_URL, data);
};
export const elementPublishLogs = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.element_publish_logs;
  return ApiService.post(METHOD_URL, data);
};
export const elementAccessLogs = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.element_access_logs;
  return ApiService.post(METHOD_URL, data);
};
export const elementProcessOwnerAccessLogs = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.reports?.element_process_owner_access_logs;
  return ApiService.post(METHOD_URL, data);
};
export const elementActivityTransitionLogs = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.reports?.element_activity_transition_logs;
  return ApiService.post(METHOD_URL, data);
};
export const userList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.user_list;
  return ApiService.post(METHOD_URL, data);
};
export const moduleTypeList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.module_type_list;
  return ApiService.post(METHOD_URL, data);
};
export const elementList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.element_list;
  return ApiService.post(METHOD_URL, data);
};
export const unitList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.unit_list;
  return ApiService.post(METHOD_URL, data);
};
export const departmentList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.department_list;
  return ApiService.post(METHOD_URL, data);
};
export const roleList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.role_list;
  return ApiService.post(METHOD_URL, data);
};
export const dependentUserList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.dependent_user_list;
  return ApiService.post(METHOD_URL, data);
};
export const testNameList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.test_name_list;
  return ApiService.post(METHOD_URL, data);
};
export const testAttemptLogs = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.test_attempt_logs;
  return ApiService.post(METHOD_URL, data);
};
export const testAttemptDetails = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.test_attempt_log_details;
  return ApiService.post(METHOD_URL, data);
};
