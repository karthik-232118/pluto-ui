import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// CreateRisk
export const CreateRiskAPI = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.CreateRisk;
  return ApiService.post(METHOD_URL, data);
};

//   SOP_List

export const SOP_List_API = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.SOP_List;
  return ApiService.post(METHOD_URL, data);
};

// Get_Risk_List
export const Get_Risk_List_API = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.Get_Risk_List;
  return ApiService.post(METHOD_URL, data);
};

// Get_Risk_By_RiskID

  export const Get_Risk_By_RiskID_API = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.Get_Risk_By_RiskID;
    return ApiService.post(METHOD_URL, data);
  };

// Get_RiskAdded_SOPList

export const Get_RiskAdded_SOPList_API = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.Get_RiskAdded_SOPList;
  return ApiService.post(METHOD_URL, data);
}


// Delete_Risk

export const Delete_Risk_API = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.Delete_Risk;
  return ApiService.post(METHOD_URL, data);
} 

// Edit_Risk

export const Edit_Risk_API = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.Edit_Risk;
  return ApiService.post(METHOD_URL, data);
}

// Risk_Dashboard

export const Risk_Dashboard_API = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOPRisk?.Risk_Dashboard;
  return ApiService.post(METHOD_URL, data);
}