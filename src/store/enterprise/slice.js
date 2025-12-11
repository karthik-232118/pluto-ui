import { createSlice } from "@reduxjs/toolkit";
import {
  Getentrprise,
  GetRoleList,
  GetZone,
  GetDepartment,
  GetUnitlist,
} from "./action";

const initialState = {
  enterpriselist: [],
  zonelist: [],
  loading: false,
  error: null,
  rolelist: [],
  departmentlist: [],
  unitList: [],
};

const enterprise = createSlice({
  name: "elements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(Getentrprise.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(Getentrprise.fulfilled, (state, action) => {
      state.loading = false;
      state.enterpriselist = action.payload;
    });
    builder.addCase(Getentrprise.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
    builder.addCase(GetZone.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetZone.fulfilled, (state, action) => {
      state.loading = false;
      state.zonelist = action.payload;
    });
    builder.addCase(GetZone.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
    builder.addCase(GetRoleList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetRoleList.fulfilled, (state, action) => {
      state.loading = false;
      state.rolelist = action.payload;
    });
    builder.addCase(GetRoleList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    builder.addCase(GetDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.departmentlist = action.payload;
    });
    builder.addCase(GetDepartment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    builder.addCase(GetUnitlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetUnitlist.fulfilled, (state, action) => {
      state.loading = false;
      state.unitList = action.payload;
    });
    builder.addCase(GetUnitlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export default enterprise.reducer;
