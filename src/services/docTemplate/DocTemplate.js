import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


// get_doc_empty_template

export const GetDocEmptyTemplateApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.docTemplate?.get_doc_empty_template;
  return ApiService.post(METHOD_URL);
};

// create_template_and_blank_document
export const CreateTemplateAndBlankDocumentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.docTemplate?.create_template_and_blank_document;
  return ApiService.post(METHOD_URL, data);
};

// Save_and_send
export const SaveAndSendApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.docTemplate?.Save_and_send;
  return ApiService.post(METHOD_URL, data);
};

// delete_template
export const DeleteTemplateApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.docTemplate?.delete_template;
  return ApiService.post(METHOD_URL, data);
};

// get_template_list

export const GetTemplateListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.docTemplate?.get_template_list;
  return ApiService.post(METHOD_URL, data);
}