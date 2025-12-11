import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";

// Elements Files and Folder API
export const ElementsFolderFileApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.folder_files;
  return ApiService.post(METHOD_URL, data);
};

// Elements Category API
export const ElementsCategoryApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.folder_files;
  return ApiService.post(METHOD_URL, data);
};

// GetModalElementsCategoryApi
export const GetModalElementsCategoryApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.folder_files;
  return ApiService.post(METHOD_URL, data);
};
// Elements Document API
export const ElementsFolderDocumentApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.document_details;
  return ApiService.post(METHOD_URL, data);
};



//SideBar_API_
export const ElementsSidebarApi = () => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.left_side_bar;
  return ApiService.post(METHOD_URL);
};

export const CategoryApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.Category;
  return ApiService.post(METHOD_URL, data);
};

// Add dipartment
export const GetChatsListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.get_chats;
  return ApiService.post(METHOD_URL, data);
};

export const SendMessageApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.send_message;
  return ApiService.post(METHOD_URL, data);
};


export const GetContactListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.get_contact_list;
  return ApiService.post(METHOD_URL, data);
};


export const ReadChatApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.read_chats;
  return ApiService.post(METHOD_URL, data);
};


 
// SOPOne
export const GetSopOneApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.sopone?.SOP_One;
  return ApiService.post(METHOD_URL, data);
};
// SOPTwo
export const GetSopTwoApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.soptwo?.SOP_Two;
  return ApiService.post(METHOD_URL, data);
};
 

// add_comment_to_pdf

export const AddCommentToPdfApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.add_comment_to_pdf;
  return ApiService.post(METHOD_URL, data);
}

// update_comment_to_pdf

export const UpdateCommentToPdfApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.update_comment_to_pdf;
  return ApiService.post(METHOD_URL, data);
}

// delete_comment_to_pdf

export const DeleteCommentToPdfApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.delete_comment_to_pdf;
  return ApiService.post(METHOD_URL, data);
}

// edit_resolve_comment_to_pdf

export const ReplyResolveCommentToPdfApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.reply_resolve_comment_to_pdf;
  return ApiService.post(METHOD_URL, data);
}

// add_document_reading_timing

export const AddDocumentReadingTimingApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.add_document_reading_timing;
  return ApiService.post(METHOD_URL, data);
}

// template_files
export const TemplateFilesApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.elements?.template_files;
  return ApiService.post(METHOD_URL, data);
}