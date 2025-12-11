import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// sopattachmentlist

export const CreateSOPTemplateApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopTemplate?.create_SOP_Template;
  return ApiService.post(METHOD_URL, data);
};

// list_SOP_Template

export const ListSOPTemplateApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopTemplate?.list_SOP_Template;
  return ApiService.post(METHOD_URL, data);
};
