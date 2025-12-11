import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmationPopup from "../allpages/masterpopups/DeleteConfirmationPopup";
import RequestForm from "../requestForm/requestForm";
import { DeleteReq, GetMyrequest } from "../../store/myrequest/action";
import EditReqModal from "./EditReqModal";
import Nodata from "../allpages/masterpopups/Nodata";
import { dateformatter } from "../../utils";
import { useTheme } from "@emotion/react";
import BackgroundMeshBox from "../../common/meshbackground/BackgroundMeshBox";
import { useTranslation } from "react-i18next";

const getStatusStyle = (status) => ({
  color: status !== "Pending" ? "#027A48" : "#B42318",
  backgroundColor: status !== "Pending" ? "#ECFDF3" : "#FEF3F2",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

const RequestList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getmyrequest, loading } = useSelector((state) => state.myReq);
  const { userdata } = useSelector((state) => state?.user);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [alert, setAlert] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const theme = useTheme()
  useEffect(() => {
    dispatch(GetMyrequest());
  }, []);

  const onConfirm = () => {
    if (editData) {
      const payload = { RequestManagementID: editData.RequestManagementID };
      dispatch(DeleteReq(payload));
      setAlert(false);
    }
  };

  const onClose = () => {
    setOpen(false);
    setEditData(null);
    setStatusMessage("");
  };

  const handleRowClick = (row) => {
    if (userdata?.UserType === "Admin" && row.RequestStatus === "Pending") {
      setEditData(row);
      setOpen(true);
    }
  };

  const handleEditClick = (row) => {
    if (row.RequestStatus === "Pending") {
      setEditData(row);
      setOpen(true);
    } else {
      setStatusMessage(
        `You can't edit this request. Status: ${row.RequestStatus}`
      );
    }
  };

  const handleDeleteClick = (row) => {
    if (row.RequestStatus === "Pending") {
      setEditData(row);
      setAlert(true);
    } else {
      setStatusMessage(
        `You can't delete this request. Status: ${row.RequestStatus}`
      );
    }
  };

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      {userdata?.UserType !== "Admin" && <RequestForm />}
      <Box
        sx={{
          margin: "25px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: theme.palette.background.Paper, // Dynamic background color

        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: "500" }}>
          {t("myRequests")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
           {t("listOfRequests")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: theme.palette.background.default, // Dynamic background color
          margin: "25px",
          borderRadius: "8px",
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("title")}</TableCell>
                <TableCell>{t("priority")}</TableCell>
                <TableCell>{t("requestedBy")}</TableCell>
                <TableCell>{t("requestedDate")}</TableCell>
                <TableCell>{t("status")}</TableCell>
                {userdata?.UserType !== "Admin" && (
                  <TableCell>{t("rejectedReason")}</TableCell>
                )}

                {userdata?.UserType !== "Admin" && (
                  <TableCell>{t("actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {getmyrequest?.data?.length > 0 ? (
                getmyrequest?.data?.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() =>
                      userdata?.UserType === "Admin" && handleRowClick(row)
                    }
                    style={{
                      cursor:
                        userdata?.UserType === "Admin" ? "pointer" : "default",
                    }}
                  >
                    <TableCell>{row.RequestTitle}</TableCell>
                    <TableCell>{row.RequestPriority}</TableCell>
                    <TableCell>
                      {row.CreatedUser.UserFirstName ||
                        row.CreatedUser.UserLastName
                        ? `${row.CreatedUser.UserFirstName || ""} ${row.CreatedUser.UserLastName || ""
                        }`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row?.CreatedDate ? dateformatter(row?.CreatedDate) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Box sx={getStatusStyle(row.RequestStatus)}>
                        {row.RequestStatus}
                      </Box>
                    </TableCell>

                    {userdata?.UserType !== "Admin" && (
                      <TableCell>{row.RejectedReason}</TableCell>
                    )}
                    {userdata?.UserType !== "Admin" && (
                      <TableCell>
                        <Tooltip title={t("edit_request")}>
                          <span>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(row);
                              }}
                              disabled={row.RequestStatus !== "Pending"}
                            >
                              <Edit />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={t("delete_request")}>
                          <span>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(row);
                              }}
                              disabled={row.RequestStatus !== "Pending"}
                            >
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={userdata?.UserType === "Admin" ? 5 : 6}>
                    <Nodata image={true} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <EditReqModal editdata={editData} onClose={onClose} open={open} userdata={userdata} />
      <DeleteConfirmationPopup
        open={alert}
        onClose={() => setAlert(false)}
        onConfirm={onConfirm}
        title= {t("deleteModal.deleteConfirmation")}
      />
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </BackgroundMeshBox>
  );
};

export default RequestList;
