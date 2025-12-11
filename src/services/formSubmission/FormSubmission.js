import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


// get_form_submission
export const GetFormSubmissionApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.FormSubmission?.get_form_submission;
  return ApiService.post(METHOD_URL, data);
};


