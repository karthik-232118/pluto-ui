import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const createFormModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.formModule?.create_form_module;
  return ApiService.post(METHOD_URL, data);
};

export const viewFormModuleDraft = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.formModule?.view_form_module_draft;
  return ApiService.post(METHOD_URL, data);
};

export const listFormModuleDraftVersion = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.formModule?.list_form_draft_version;
  return ApiService.post(METHOD_URL, data);
};

export const publishFormModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.formModule?.publish_form_module;
  return ApiService.post(METHOD_URL, data);
};

export const deleteFormModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.formModule?.delete_form_module;
  return ApiService.post(METHOD_URL, data);
};

export const verifyUserPermissionToEditForm = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.formModule?.verify_user_permission_to_edit_form;
  return ApiService.post(METHOD_URL, data);
};

export const listProcessOwner = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.list_process_owner;
  return ApiService.post(METHOD_URL, data);
};

export const listProcessOwnerAndEndUser = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.list_process_owner_and_end_user;
  return ApiService.post(METHOD_URL, data);
};

export const generateTokenForDynamicForm = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.generate_token_for_dynamic_form;
  return ApiService.post(METHOD_URL, data);
};
