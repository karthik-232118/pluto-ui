import { BASE_URL, BASE_URL_AUTH, ENDPOINT_URL } from "../../config/urlConfig";
import { UnAuthApiService } from "../../config/apiServices";


export const LoginApi = (loginData) => {
  const METHOD_URL = BASE_URL_AUTH + ENDPOINT_URL?.auth?.login
  return UnAuthApiService.post(METHOD_URL, loginData);
};

export const AccessTokenApi = (accessTokenData) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.auth?.access_token;

  return UnAuthApiService.post(METHOD_URL, accessTokenData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const LogoutApi = (data) => {
  const token = localStorage.getItem('access_token'); // Get the token from localStorage
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.auth?.logout;
  return UnAuthApiService.post(METHOD_URL, data, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

// export const LogoutApi = createAsyncThunk(
//   "Login",
//   async (data, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('access_token'); // Get the token from localStorage
//       const METHOD_URL = BASE_URL + ENDPOINT_URL?.auth?.logout;
//       return UnAuthApiService.post(METHOD_URL, data, {
//         headers: {
//           'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
//         },
//       });
//     } catch (error) {
//       return rejectWithValue(error?.response?.data || "An error occurred");
//     }
//   }
// );

