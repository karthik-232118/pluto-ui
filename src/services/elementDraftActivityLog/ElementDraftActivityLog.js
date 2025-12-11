import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

export const viewElementDraftActivity = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementDraftActivityLog?.view_draft_log;
  return ApiService.post(METHOD_URL, data);
};

export const viewElementDraftActivityHistory = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementDraftActivityLog?.view_draft_log_history;
  return ApiService.post(METHOD_URL, data);
};
