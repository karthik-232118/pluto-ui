import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


// Notes List API
export const NotesListApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.notes?.notes_list;
  return ApiService.post(METHOD_URL, data);
};


// add Note API
export const AddNoteApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.notes?.add_notes;
  return ApiService.post(METHOD_URL, data);
};


// update Note API
export const UpdateNoteApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.notes?.update_notes;
  return ApiService.post(METHOD_URL, data);
};