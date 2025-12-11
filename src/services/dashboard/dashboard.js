import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";
// DashboardApi
export const DashboardApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.dashboard;
  return ApiService.post(METHOD_URL, data);
};

// LeaderboardToggleData
export const LeaderboardToggleData = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.leaderboard_toggle_data;
  return ApiService.post(METHOD_URL, data);
};

// leaderboard_data

export const LeaderboardData = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.leaderboard_data;
  return ApiService.post(METHOD_URL, data);
};

export const ProcessOwnerDashboardApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.process_owner_dashboard;
  return ApiService.post(METHOD_URL, data);
};

export const ProcessOwnerDepartmentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.department_overview;
  return ApiService.post(METHOD_URL, data);
};

export const GetDashboardAdminApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.admin_dashboard;
  return ApiService.post(METHOD_URL, data);
};

export const GetDashboardElementDetailsApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.dashboard_element_details;
  return ApiService.post(METHOD_URL, data);
};


export const GetDynamicDashboardApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.dynamic_dashboard;
  return ApiService.post(METHOD_URL, data);
};


export const ActionableApi = async () => {
  try {
    const userType = localStorage.getItem("user_type");
    if (userType == "ProcessOwner") {
      const METHOD_URL =
        BASE_URL + ENDPOINT_URL?.home?.process_owner_actionable;

      const response = await ApiService.post(METHOD_URL);
      return response.data.actionable;
    } else if (userType == "EndUser") {
      const METHOD_URL = BASE_URL + ENDPOINT_URL?.home?.dashboard_actionable;
      const response = await ApiService.post(METHOD_URL);
      return response.data.actionable;
    }

    // Extracting only the actionable data
  } catch (error) {
    console.error("Error fetching actionable data:", error);
    return [];
  }
};
