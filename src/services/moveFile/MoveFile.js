import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";


// move_file_API
export const MoveFileAPI = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.move_file?.move_file_API;
    return ApiService.post(METHOD_URL, data);
  };