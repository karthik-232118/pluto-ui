import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// CreateSOP
export const CreateSOPReactFlow = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOP_react_flow?.createSOPflow;
  return ApiService.post(METHOD_URL, data);
};

// viweSOPflow
export const ViewSOPReactFlow = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOP_react_flow?.viweSOPflow;
  return ApiService.post(METHOD_URL, data);
};
export const ViewSOPReactFlowVesrionOne = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOP_react_flow?.viweSOPflow;
  return ApiService.post(METHOD_URL, data);
};
export const ViewSOPReactFlowVersionTwo = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOP_react_flow?.viweSOPflow;
  return ApiService.post(METHOD_URL, data);
};

// uploadimageSOPflow
export const UploadImageSOPReactFlow = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOP_react_flow?.uploadimageSOPflow;
    return ApiService.post(METHOD_URL, data);
 };

// send_sop_upload_pdf_url

export const SendSOPUploadPdfUrl = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.SOP_react_flow?.send_sop_upload_pdf_url;
  return ApiService.post(METHOD_URL, data);
};