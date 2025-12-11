import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const viewSopModuleDraft = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.view_sop_module_draft;
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

export const listSopModuleDraftVersion = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.list_sop_draft_version;
  return ApiService.post(METHOD_URL, data);
};

export const createSopModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.create_sop_module;
  return ApiService.post(METHOD_URL, data);
};

export const publishSopModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.publish_sop_module;
  return ApiService.post(METHOD_URL, data);
};

export const deleteSopModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.delete_sop_module;
  return ApiService.post(METHOD_URL, data);
};

// isTemplate_sop_module_list
export const isTemplateSopModuleList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.isTemplate_sop_module_list;
  return ApiService.post(METHOD_URL, data);
};

// viewTemplate_sop_module

export const viewTemplateSopModule = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopModule?.viewTemplate_sop_module;
  return ApiService.post(METHOD_URL, data);
};
