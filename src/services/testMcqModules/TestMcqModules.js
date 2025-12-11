import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const createTestMCQModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.testMCQModule?.create_test_mcq_module;
  return ApiService.post(METHOD_URL, data);
};

export const viewTestMCQModuleDraft = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.testMCQModule?.view_test_mcq_module_draft;
  return ApiService.post(METHOD_URL, data);
};

export const listTestMCQModuleDraftVersion = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.testMCQModule?.list_test_mcq_draft_version;
  return ApiService.post(METHOD_URL, data);
};

export const publishTestMCQModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.testMCQModule?.publish_test_mcq_module;
  return ApiService.post(METHOD_URL, data);
};

export const deleteTestMCQModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.testMCQModule?.delete_test_mcq_module;
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

// list_mcqs

export const listMcqc = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.testMCQModule?.list_mcqs;
  return ApiService.post(METHOD_URL, data);
};


// bulk_test_mcqs_upload

export const bulkTestMcqsUpload = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.testMCQModule?.bulk_test_mcqs_upload;
  return ApiService.post(METHOD_URL, data);
};
  
