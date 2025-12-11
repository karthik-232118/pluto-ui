import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService } from "../../config/apiServices";
// favourites_list
export const FavouritesApi = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.favourites?.favourites_list;
  return ApiService.post(METHOD_URL, data);
};
// add_favourites_list
export const AddFavouritesApi = (data) => {
    const METHOD_URL = BASE_URL + ENDPOINT_URL?.favourites?.add_favourites_list;
    return ApiService.post(METHOD_URL, data);
  };