import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// save_uploaded_dashboard
export const SaveUploadedDashboardApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.save_uploaded_dashboard;
  return ApiService.post(METHOD_URL, data);
};

// get_all_datasource_by_type
export const GetAllDataSourceByTypeApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.get_all_datasource_by_type;
  return ApiService.post(METHOD_URL, data);
};

// get_all_datasource_by_id
export const GetAllDataSourceByIdApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.get_all_datasource_by_id;
  return ApiService.post(METHOD_URL, data);
};

//   update_datasource
export const UpdateDataSourceApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.update_datasource;
  return ApiService.post(METHOD_URL, data);
};

// delete_datasource
export const DeleteDataSourceApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.delete_datasource;
  return ApiService.post(METHOD_URL, data);
};

// get_all_dashboards
export const GetAllDashboardsApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.get_all_dashboards;
  return ApiService.post(METHOD_URL, data);
}

// create_dynamic_chart
export const CreateDynamicChartApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.create_dynamic_chart;
  return ApiService.post(METHOD_URL, data);
};

// get_all_dynamic_chart
export const GetAllDynamicChartApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.get_all_dynamic_chart;
  return ApiService.post(METHOD_URL, data);
};

// get_dynamic_chart_by_id
export const GetDynamicChartByIdApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.get_dynamic_chart_by_id;
  return ApiService.post(METHOD_URL, data);
}

// voDOd8S66Qu5zPA
export const UpdateDynamicChartApi = (data) => {  
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.update_dynamic_chart;
  return ApiService.post(METHOD_URL, data);
};

// delete_dynamic_chart
export const DeleteDynamicChartApi = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.dashboard_builder?.delete_dynamic_chart;
  return ApiService.post(METHOD_URL, data);
};

// assign_chart_to_user
export const AssignChartToUserAPI = (data) =>{
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.dashboard_builder?.assign_chart_to_user;
  return ApiService.post(METHOD_URL , data)
}

// get_Assigned_Charts_of_current_User
export const GetAssignedChartsOfCurrentUserAPI = (data) =>{
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.dashboard_builder?.get_Assigned_Charts_of_current_User; 
  return ApiService.post(METHOD_URL , data)
}