import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// create_and_edit_mail_template

export const CreateAndEditMailTemplate = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.email_Template?.create_and_edit_mail_template;
  return ApiService.post(METHOD_URL, data);
};

// get_all_mail_template

export const GetAllMailTemlate = () => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.email_Template?.get_all_mail_template;
  return ApiService.post(METHOD_URL);
};

// delete_mail_template

export const DeleteMailTemplate = (data) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.email_Template?.delete_mail_template;
  return ApiService.post(METHOD_URL, data);
};

// get_mail_template_by_id

export const GetMailTemplateByID =(data)=>{
   const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.email_Template?.get_mail_template_by_id;
  return ApiService.post(METHOD_URL, data);
}