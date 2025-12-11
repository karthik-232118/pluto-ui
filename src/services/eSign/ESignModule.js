import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

export const uploadPdf = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.upload_esign_pdf;
  return FileUploadService.post(METHOD_URL, data);
};

export const createESignRequest = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.create_esign_request;
  return ApiService.post(METHOD_URL, data);
};

export const fetchESignDashboardCards = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.eSign?.fetch_esign_dashboard_cards;
  return ApiService.post(METHOD_URL, data);
};

export const fetchESignDashboard = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.fetch_esign_dashboard;
  return ApiService.post(METHOD_URL, data);
};

export const fetchESignDashboardActivity = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.eSign?.fetch_esign_dashobard_activity;
  return ApiService.post(METHOD_URL, data);
};

export const viewESignRequest = ({ ESignRequestID, receiverId, ip }) => {
  const METHOD_URL = `${BASE_URL}${ENDPOINT_URL?.eSign?.view_esign_request}/${ESignRequestID}`;

  const params = {
    receiverId,
    ip,
  };
  return ApiService.get(METHOD_URL, { params });
};

export const fillESignRequest = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.fill_esign_request;
  return ApiService.post(METHOD_URL, data);
};


export const sendBulkemails = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.bulk_email;
  return ApiService.post(METHOD_URL, data);
};


export const getforms = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.get_forms;
  return ApiService.post(METHOD_URL, data);
};

export const getcampListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.eSign?.get_camplist;
  return ApiService.post(METHOD_URL, data);
};
export const getbulkemailList = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.get_email_reports;
  return ApiService.post(METHOD_URL, data);
};


export const exportCampaing = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.export_campaign;
  return ApiService.post(METHOD_URL, data);
};

// sop_reading_logs

export const sopReadingLogsApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.reports?.sop_reading_logs;
  return ApiService.post(METHOD_URL, data);
};
