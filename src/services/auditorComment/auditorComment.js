import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";



// add_auditor_Comment

export const AddAuditorCommentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.auditorComment?.add_auditor_Comment;
  return ApiService.post(METHOD_URL, data);
}