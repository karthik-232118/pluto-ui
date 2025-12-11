import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// Add dipartment
export const AddDipartmentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.add_dipartment;
  return ApiService.post(METHOD_URL, data);
};

export const AddEnterprisesApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.add_enterprise;
  return ApiService.post(METHOD_URL, data);
};

export const EditEditenterpriseApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.edit_enterprise;
  return ApiService.post(METHOD_URL, data);
};
export const EditDepartmentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.update_department;
  return ApiService.post(METHOD_URL, data);
};

export const enterpriseApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.getinterprise;
  return ApiService.post(METHOD_URL ,data);
};

export const getZoneApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.get_zone_api;
  return ApiService.post(METHOD_URL);
};
export const getUnitApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.get_unit_api;
  return ApiService.post(METHOD_URL);
};
export const AddRoleApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.add_role;
  return ApiService.post(METHOD_URL, data);
};
// updateRoleApi
export const updateRoleApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.update_role;
  return ApiService.post(METHOD_URL, data);
};

export const EditZoneAPi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.update_zone;
  return ApiService.post(METHOD_URL, data);
};
export const AddZoneApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.add_zone;
  return ApiService.post(METHOD_URL, data);
};

export const getroles = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.getroles;
  return ApiService.post(METHOD_URL);
};
export const getDepartmentApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.get_dep;
  return ApiService.post(METHOD_URL);
};

export const deleteUnitApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.delete_unit;
  return ApiService.post(METHOD_URL, data);
};

export const deleteRoleApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.delete_role;
  return ApiService.post(METHOD_URL, data);
};

export const deleteddpartmentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.delete_department;
  return ApiService.post(METHOD_URL, data);
};

export const deleteZoneApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.delete_zone;
  return ApiService.post(METHOD_URL, data);
};

export const deletenterprisesApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.delete_enterprise;
  return ApiService.post(METHOD_URL, data);
};


// pin_elements_api

export const pinElementsApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.pin_elements_api;
  return ApiService.post(METHOD_URL, data);
};


export const getEnterpriseInfoApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.enterprise.get_enterprise_info;
  return ApiService.post(METHOD_URL);
}