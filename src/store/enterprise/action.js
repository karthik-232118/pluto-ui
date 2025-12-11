// ElementsFolderFileApi
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddDipartmentApi,
  AddZoneApi,
  AddRoleApi,
  enterpriseApi,
  getroles,
  updateRoleApi,
  deleteRoleApi,
  deleteddpartmentApi,
  deleteUnitApi,
  deleteZoneApi,
  getDepartmentApi,
  EditDepartmentApi,
  EditZoneAPi,
  getUnitApi,
  getZoneApi,
  AddEnterprisesApi,
  EditEditenterpriseApi,
  deletenterprisesApi,
  getEnterpriseInfoApi,
} from "../../services/enterprise/Enterprise";
import notify from "../../assets/svg/utils/toast/Toast";
import i18next from "i18next";
import { t } from "i18next";

const handleError = (error) => {
  const message = error?.response?.data?.message || "An error occurred";
  notify("error", message);
  return Promise.reject(message);
};
export const AddDipartment = createAsyncThunk(
  "enterprise/createDipartment",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddDipartmentApi(data);
      if (response?.status === 201) {
        notify("success", i18next.t("department_added") || response.data.message);
        dispatch(GetDepartment());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);
export const AddEnterprises = createAsyncThunk(
  "enterprise/createDipartment",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddEnterprisesApi(data);
      if (response?.status === 201) {
        notify("success", response.data.message);
        dispatch(Getentrprise());
        return true;
      } else {
        if (response.data.errors) {
          Object.values(response.data.errors).forEach((error) => {
            notify("error", error);
          });
        } else {
          notify("error", response.data.message);
        }
        return false;
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((error) => {
          notify("error", error);
        });
      } else {
        notify("error", error.response?.data?.message);
      }
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const Editenterprise = createAsyncThunk(
  "enterprise/createDipartment",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await EditEditenterpriseApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("enterprise_updated") || response.data.message);
        dispatch(Getentrprise());
        return true;
      } else {
        if (response.data.errors) {
          Object.values(response.data.errors).forEach((error) => {
            notify("error", error);
          });
        } else {
          notify("error", response.data.message);
        }
        return false;
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((error) => {
          notify("error", error);
        });
      } else {
        notify("error", error.response?.data?.message);
      }
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
export const EditAddDepartment = createAsyncThunk(
  "enterprise/EditAddDepartment",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await EditDepartmentApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("department_updated") || response.data.message);
        dispatch(GetDepartment());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);

export const Getentrprise = createAsyncThunk(
  "enterprise/Getentrprise",
  async (data, { rejectWithValue }) => {
    try {
      const response = await enterpriseApi(data);
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.data.message);
      return rejectWithValue(error?.response?.message || "An error occurred");
    }
  }
);
export const EditZone = createAsyncThunk(
  "enterprise/EditAddDepartment",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await EditZoneAPi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("updated_successfully") || response.data.message);
        await dispatch(GetZone());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);

export const AddRole = createAsyncThunk(
  "enterprise/createRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddRoleApi(data);
      if (response?.status === 201) {
        notify("success", i18next.t("role_added_to_enterprise") || response.data.message);
        await dispatch(GetRoleList());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);

export const AddZone = createAsyncThunk(
  "enterprise/AddZone",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddZoneApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("added_successfully") || response.data.message);
        await dispatch(GetZone());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);

export const Addunit = createAsyncThunk(
  "enterprise/AddZone",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddZoneApi(data);

      if (response?.status === 200) {
        notify("success", i18next.t("added_successfully") || response.data.message);
        await dispatch(GetUnitlist());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);
export const EditUnit = createAsyncThunk(
  "enterprise/EditAddDepartment",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await EditZoneAPi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("updated_successfully") || response.data.message);
        await dispatch(GetUnitlist());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
            "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
      );
    }
  }
);

export const GetZone = createAsyncThunk(
  "enterprise/Getzone",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getZoneApi();
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.data.message);
      return rejectWithValue(error?.response?.message || "An error occurred");
    }
  }
);

export const GetUnitlist = createAsyncThunk(
  "enterprise/GetUnitlist",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await getUnitApi(data);
      if (response?.status === 200) {
        // await dispatch(GetZone());
        return response?.data?.data;
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.data.message);
      return rejectWithValue(error?.response?.message || "An error occurred");
    }
  }
);

export const GetRoleList = createAsyncThunk(
  "enterprise/getRoles",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getroles(data);

      if (response?.status === 200) {
        return response?.data?.data?.Roles;
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.data.message);
      return rejectWithValue(error?.response?.message || "An error occurred");
    }
  }
);

export const updateRole = createAsyncThunk(
  "enterprise/updateRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateRoleApi(data);
      if (response?.status === 200) {
        notify("success", t("role_updated") || response.data.message);
        await dispatch(GetRoleList()); // Fetch updated roles
        return response?.status;
      }
      notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "enterprise/deleteRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteRoleApi(data);
      if (response?.status === 200) {
        notify("success", t("role_deleted") || response.data.message);
        await dispatch(GetRoleList()); // Fetch updated roles
        return data; // Return the deleted role ID for further processing
      }
      notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);

export const deleteZone = createAsyncThunk(
  "enterprise/deleteRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteZoneApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("enterprise_deleted") || response.data.message);
        await dispatch(GetZone()); // Fetch updated roles
        return data; // Return the deleted role ID for further processing
      }
      notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);
export const deleteDepartment = createAsyncThunk(
  "enterprise/deleteRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteddpartmentApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("department_deleted") || response.data.message);
        await dispatch(GetDepartment()); // Fetch updated roles
        return data; // Return the deleted role ID for further processing
      }
      notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);

export const deleteUnit = createAsyncThunk(
  "enterprise/deleteRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteUnitApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("deleted_successfully") || response.data.message);
        await dispatch(GetUnitlist()); // Fetch updated roles
        return data; // Return the deleted role ID for further processing
      }
      notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);

export const deletenterprises = createAsyncThunk(
  "enterprise/deleteRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await deletenterprisesApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("enterprise_deleted") || response.data.message);
        await dispatch(Getentrprise()); // Fetch updated roles
        return data; // Return the deleted role ID for further processing
      }
      notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);

export const GetDepartment = createAsyncThunk(
  "enterprise/GetDepartment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getDepartmentApi();
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      notify("error", error.data.message);
      return rejectWithValue(error?.response?.message || "An error occurred");
    }
  }
);
