import React, { useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Skeleton,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Nodata from "../masterpopups/Nodata";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const DataTable = ({
  columns,
  rows,
  filterOptions = [],
  title,
  loading = false,
  eSignActivityFetchHandler,
  rowCount,
  setPayload,
  setShrinkList,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("All");
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [selectedRow, setSelectedRow] = useState(null);

  // Display skeleton rows if loading
  const displayedRows = loading
    ? Array.from({ length: rows?.length || 1 }).map((_, index) => ({
        id: `skeleton-${index}`,
        sn: <Skeleton width={40} />,
        download: <Skeleton width={100} />,
        ESignDocumentName: <Skeleton width={200} />,
        ESignReferenceNumber: <Skeleton width={200} />,
        totalNumberOfReceivers: <Skeleton width={80} />,
        totalPendingForSign: <Skeleton width={80} />,
        userName: <Skeleton width={150} />,
        userEmail: <Skeleton width={150} />,
        status: <Skeleton width={80} />,
        createdDate: <Skeleton width={100} />,
      }))
    : rows;

  const noData = !loading && rows.length === 0;

  const onPageChange = (params) => {
    setShrinkList(false);
    setPaginationModel({
      page: params.page,
      pageSize: params.pageSize,
    });
    setPayload({
      status,
      page: params.page + 1,
      pageSize: params.pageSize,
    });
    setSelectedRow(null);
  };

  const handleClear = () => {
    setStatus("All");
    setPaginationModel({
      page: 0,
      pageSize: 5,
    });
    setPayload({
      status: "All",
      page: 1,
      pageSize: 5,
    });
    setSelectedRow(null);
    setShrinkList(false);
  };

  const disableClearButton =
    (status === "All" &&
      paginationModel.page === 0 &&
      paginationModel.pageSize === 5 &&
      !selectedRow &&
      !loading) ||
    (selectedRow &&
      paginationModel.page === 0 &&
      paginationModel.pageSize === 5 &&
      status === "All" &&
      !loading);

  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: (theme) => {
          theme.palette.background.paper;
        },
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {title && (
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {title}
        </Typography>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        {filterOptions.length > 0 && (
          <FormControl
            size="small"
            sx={{ minWidth: "150px" }}
            disabled={loading}
          >
            <InputLabel>{t("Sign Status")}</InputLabel>
            <Select
              label="Sign Status"
              value={status}
              onChange={(e) => {
                setShrinkList(false);
                setStatus(e.target.value);
                setPayload((prevState) => ({
                  ...prevState,
                  status: e.target.value,
                }));
                setSelectedRow(null);
              }}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button
          variant="contained"
          onClick={handleClear}
          disabled={disableClearButton}
          sx={{ textTransform: "none" }}
        >
          {t("Clear Filter")}
        </Button>
      </Box>

      {/* Data Grid */}
      {!loading && noData ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
          sx={{
            border: "1px dashed gray",
            borderRadius: "8px",
            color: "gray",
          }}
        >
          <Nodata image={true} height="100%" />
        </Box>
      ) : (
        <DataGrid
          rows={displayedRows}
          columns={columns}
          disableSelectionOnClick
          pagination
          rowHeight={75}
          getRowId={(row) => row.id || row.sn}
          paginationMode="server"
          componentsProps={{
            pagination: { disabled: loading },
          }}
          onRowClick={(params) => {
            setShrinkList(true);
            if (selectedRow === params.row.sn) {
              return;
            } else {
              eSignActivityFetchHandler({
                ESignRequestID: params?.row?.ESignRequestID,
              });
              setSelectedRow(params.row.sn);
            }
          }}
          pageSizeOptions={[5, 10, 20, 30, 40, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPageChange}
          disableColumnFilter
          disableColumnMenu
          rowCount={rowCount}
          hideFooterSelectedRowCount
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "16px",
            },
          }}
        />
      )}
    </Box>
  );
};

export default DataTable;

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  filterOptions: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool,
  eSignActivityFetchHandler: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  setPayload: PropTypes.func.isRequired,
  setShrinkList: PropTypes.func.isRequired,
};
DataTable.defaultProps = {
  filterOptions: [],
  title: "",
  loading: false,
};
DataTable.displayName = "DataTable";
DataTable.whyDidYouRender = true;
