// downloadActions.js
export const SET_DOWNLOAD_FUNCTION = "SET_DOWNLOAD_FUNCTION";

export const setDownloadFunction = (downloadFunc) => ({
  type: SET_DOWNLOAD_FUNCTION,
  payload: downloadFunc,
});
