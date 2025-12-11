import axios from "axios";
import { BASE_URL } from "../../config/urlConfig";
export const axiosService = axios.create({
  baseURL: BASE_URL, 
  timeout: 10000,
  headers: {
    'ContentType': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem("access_token")

  }
});

export const getXMLData = async (SOPID) => {
  try {
    const data = await axiosService.post(
     BASE_URL + "v1/rXos1/k1sJjoi32FX9YPk",
      {
        SOPID,
      },
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
export const updateXMLData = async (payload) => {
  try {
    const data = await axiosService.post(
      BASE_URL + "v1/rXos1/XHmfuVBkKeCcqad",
      payload,
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
export const addOrUpdateShapeDetails = async (payload) => {
  try {
    const data = await axiosService.post(
      BASE_URL + "v1/rXos1/wPQzu5zVHJHykdw",
      payload,
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
export const updateAttachedLink = async (payload) => {
  try {
    const data = await axiosService.post(
      BASE_URL + "v1/rXos1/ZReWE4KzIsjN3uQ",
      payload,
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
export const getAttachmentItemList = async (SopDetailsID) => {
  try {

    const data = await axiosService.post(
      BASE_URL + "v1/rXos1/jLiaFOvJcl2DSkv",
      {
        SopDetailsID,
      },
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
export const getSearchElementList = async (SearchText) => {
  try {
    const data = await axiosService.post(
      BASE_URL + "v1/rXos1/rfZmc7KvVgl0GXt",
      {
        SearchText,
      },
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
