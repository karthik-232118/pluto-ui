import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

export const viewTestSimulationModuleDraft = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.testSimulationModule?.view_test_simulation_module_draft;
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

export const listTestSimulationModuleDraftVersion = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.testSimulationModule?.list_test_simulation_draft_version;
  return ApiService.post(METHOD_URL, data);
};

export const createTestSimulationModule = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.testSimulationModule?.create_test_simulation_module;
  return ApiService.post(METHOD_URL, data);
};

export const publishTestSimulationModule = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.testSimulationModule?.publish_test_simulation_module;
  return ApiService.post(METHOD_URL, data);
};

export const deleteTestSimulationModule = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.testSimulationModule?.delete_test_simulation_module;
  return ApiService.post(METHOD_URL, data);
};
