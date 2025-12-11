import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

export const viewDocumentModuleDraft = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.view_document_module_draft;
  return ApiService.post(METHOD_URL, data);
};

export const listProcessOwner = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.list_process_owner;
  return ApiService.post(METHOD_URL, data);
};

export const listEndUser = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.list_end_user;
  return ApiService.post(METHOD_URL, data);
};

export const listProcessOwnerAndEndUser = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.list_process_owner_and_end_user;
  return ApiService.post(METHOD_URL, data);
};

export const listDocumentModuleDraftVersion = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.list_document_draft_version;
  return ApiService.post(METHOD_URL, data);
};

export const createDocumentModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.create_document_module;
  return ApiService.post(METHOD_URL, data);
};

export const createBulkDocumentModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.bulk_create_document_module;
  return ApiService.post(METHOD_URL, data);
};

export const publishDocumentModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.publish_document_module;
  return ApiService.post(METHOD_URL, data);
};

export const deleteDocumentModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.delete_document_module;
  return ApiService.post(METHOD_URL, data);
};

export const exportDocumentModule = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.export_document_module;
  return ApiService.post(METHOD_URL, data);
};

export const syncModule = () => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.sync_document_module;
  return ApiService.post(METHOD_URL);
};

export const updateIsAccepted = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.update_status_document_module;
  return ApiService.post(METHOD_URL, data);
};



  // Published_Document_List
export const publishedDocumentList = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.published_document_list;
  return ApiService.post(METHOD_URL, data);
}

export const createElementAttributeType = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAttributeType?.createElementAttributeType;
  return ApiService.post(METHOD_URL, data);
};

export const listElementAttributeType = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAttributeType?.listElementAttributeType;
  return ApiService.post(METHOD_URL, data);
};

export const deleteElementAttributeType = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAttributeType?.deleteElementAttributeType;
  return ApiService.post(METHOD_URL, data);
};

export const ViewElementAttributeType = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAttributeType?.viewElementAttributeType;
  return ApiService.post(METHOD_URL, data);
}
export  const linkedElements = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.elementAttributeType?.linkedElements;
  return ApiService.post(METHOD_URL, data);
}

// create_template

export const createTemplate = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.create_template;
  return ApiService.post(METHOD_URL, data);
};  

// fetch_dox_template

export const fetchDoxTemplate = () => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.fetch_dox_template;
  return ApiService.post(METHOD_URL);
};

// fetch_docx_template_API

export const fetchDocxTemplateAPI = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.fetch_docx_template_API;
  return ApiService.post(METHOD_URL, data);
};

// convert_docx_to_pdf

export const convertDocxToPdf = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.documentModule?.convert_docx_to_pdf;
  return ApiService.post(METHOD_URL, data);
}