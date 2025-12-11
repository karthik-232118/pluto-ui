import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// sop_Attachment_List
export const SopAttachmentListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopattachmentlist?.sop_Attachment_List;
  return ApiService.post(METHOD_URL, data);
}