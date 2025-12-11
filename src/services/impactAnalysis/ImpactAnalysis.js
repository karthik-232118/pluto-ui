import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const viewImpactAnalysis = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.impactAnalysis?.impact_analysis;
  return ApiService.post(METHOD_URL, data);
};
