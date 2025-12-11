import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


// add RiskandCompliences
export const AddRiskAndCompliencesApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.RiskandCompliences?.add_Risk_Compliences;
  return ApiService.post(METHOD_URL, data);
};


// add_Risk_Compliences

export const ListRiskAndCompliencesApi = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.RiskandCompliences?.List_Risk_Compliences;
    return ApiService.post(METHOD_URL, data);
  };