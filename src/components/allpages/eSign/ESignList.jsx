import React from "react";
import {
  Box,
  CircularProgress,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import DataTable from "./DataTable"; // Assuming you have this component
import ChipWithTooltip from "./ChipWithTooltip";
import { BASE_URL } from "../../../config/urlConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ListESigns = ({
  data = [],
  loading,
  eSignActivityFetchHandler,
  rowCount,
  setPayload,
  setShrinkList,
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const {t} = useTranslation();

  const columns = [
    {
      field: "sn",
      headerName: t("SN"),
      width: 80,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={40} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
    {
      field: "download",
      headerName: t("Download"),
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Download Signed Document" arrow>
          {loading ? (
            <Skeleton width={100} />
          ) : isDownloading && isDownloading === params?.row?.ESignRequestID ? (
            <CircularProgress size={24} />
          ) : (
            <DownloadIcon
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(params.row);
              }}
            />
          )}
        </Tooltip>
      ),
    },
    {
      field: "ESignDocumentName",
      headerName: t("Document Name"),
      minWidth: 350,
      maxWidth: 500,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={200} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
    {
      field: "ESignReferenceNumber",
      headerName: t("Reference Number"),
      width: 300,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={200} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
    {
      field: "totalNumberOfReceivers",
      headerName: t("No. Of Receiver"),
      width: 200,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={80} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
    {
      field: "totalPendingForSign",
      headerName: t("Pending for signer"),
      width: 200,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={80} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
    {
      field: "userName",
      headerName: t("Receiver Name"),
      minWidth: 350,
      maxWidth: 500,
      sortable: false,
      renderCell: (params) => {
        const receivers = params?.row?.receivers || [];
        return loading ? (
          <Skeleton width={150} />
        ) : (
          <ChipWithTooltip
            data={receivers}
            firstLevelKey="UserName"
            nestedKey="" // You can provide a nested key if needed
          />
        );
      },
    },
    {
      field: "userEmail",
      headerName: t("Email ID"),  
      minWidth: 450,
      maxWidth: 500,
      sortable: false,
      renderCell: (params) => {
        const receivers = params?.row?.receivers || [];
        return loading ? (
          <Skeleton width={150} />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <ChipWithTooltip
              data={receivers}
              firstLevelKey="UserEmail"
              nestedKey="" // You can provide a nested key if needed
            />
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: t("Status"),
      width: 200,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={80} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
    {
      field: "createdDate",
      headerName: t("Date"),
      width: 350,
      sortable: false,
      renderCell: (params) =>
        loading ? (
          <Skeleton width={100} />
        ) : (
          <Tooltip title={params.value} arrow>
            <Typography>{params.value}</Typography>
          </Tooltip>
        ),
    },
  ];

  const handleDownload = async (row) => {
    const pdfUrl = row?.receivers[row?.receivers.length - 1]?.SignedDocumentURL;
    const fullPdfUrl = `${BASE_URL}${pdfUrl}`;
    if (pdfUrl) {
      try {
        setIsDownloading(row?.ESignRequestID);
        const response = await fetch(fullPdfUrl);
        if (!response.ok) throw new Error("Failed to fetch the file");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = row?.ESignDocumentName || "signed_document.pdf"; 
        link.click(); 
        window.URL.revokeObjectURL(url);
      } catch (error) {
        toast.error("Failed to download the document");
      } finally {
        setIsDownloading(false);
      }
    } else {
      toast.error("No signed document found");
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <DataTable
        columns={columns}
        rows={data}
        filterOptions={[
          t("statuses.all"),
          t("statuses.sent"),
          t("statuses.received"),
          t("statuses.completed"),
          t("statuses.pending"),
          t("statuses.expired"),
        ]}
        loading={loading}
        eSignActivityFetchHandler={eSignActivityFetchHandler}
        rowCount={rowCount}
        setPayload={setPayload}
        setShrinkList={setShrinkList}
      />
    </Box>
  );
};

export default ListESigns;

ListESigns.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  eSignActivityFetchHandler: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  setPayload: PropTypes.func.isRequired,
  setShrinkList: PropTypes.func.isRequired,
};
ListESigns.defaultProps = {
  data: [],
  loading: false,
};
