import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

export const viewTrainingSimulationModuleDraft = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.trainingSimulationModule
      ?.view_training_simulation_module_draft;
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

export const listTrainingSimulationModuleDraftVersion = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.trainingSimulationModule
      ?.list_training_simulation_draft_version;
  return ApiService.post(METHOD_URL, data);
};

export const createTrainingSimulationModule = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.trainingSimulationModule?.create_training_simulation_module;
  return ApiService.post(METHOD_URL, data);
};

export const publishTrainingSimulationModule = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.trainingSimulationModule?.publish_training_simulation_module;
  return ApiService.post(METHOD_URL, data);
};

export const deleteTrainingSimulationModule = (data) => {
  const METHOD_URL =
    BASE_URL +
    ENDPOINT_URL?.trainingSimulationModule?.delete_training_simulation_module;
  return ApiService.post(METHOD_URL, data);
};
