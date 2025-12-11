import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import {
  deleteDepartment,
  GetDepartment,
} from "../../../store/enterprise/action";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmationPopup from "../masterpopups/DeleteConfirmationPopup";
import AddIcon from "../../../assets/svg/uesrmanagement/AddIcon.svg";
import NewDepartment from "../masterpopups/NewDepartment";
import Nodata from "../masterpopups/Nodata";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";
// Dummy data

const getStatusStyle = (status) => ({
  color: status ? "#027A48" : "#B42318",
  backgroundColor: status ? "#ECFDF3" : "#FEF3F2",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

const Department = () => {
  const { t } = useTranslation();
  const disptach = useDispatch();
  const { departmentlist } = useSelector((state) => state.enterprise);
  const [open, setOpen] = useState(false);
  const [editdata, setEditdata] = useState(null);
  const [Alert, setAlert] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    disptach(GetDepartment());
  }, []);

  const onConfirm = () => {
    const payload = {
      DepartmentID: editdata?.DepartmentID,
    };
    disptach(deleteDepartment(payload));
    setAlert(false);
    setEditdata(null);
  };
  const onClose = () => {
    setOpen(false);
    setEditdata(null);
  };

  const userType = localStorage.getItem("user_type");
  if (userType === "EndUser" || userType === "ProcessOwner") {
    return <AccessDenied />;
  }

  return (
    <>
      <Box
        sx={{
          margin: "25px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: "500" }}>
            {t("department_management")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("department_list_description")}
          </Typography>
        </Box>

        <Button
          sx={{
            height: "40px",
            textTransform: "none",
          }}
          variant="contained"
          size="small"
          endIcon={<img src={AddIcon} />}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("new_department")}
        </Button>
      </Box>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: theme.palette.background.default,
          margin: "25px",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        ></Box>
        <Box></Box>
        <Divider sx={{ marginTop: 2 }} />
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "73vh",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: theme.palette.background.default,
              }}
            >
              <TableRow>
                <TableCell>{t("title")}</TableCell>
                <TableCell>{t("enterprise")}</TableCell>
                <TableCell>{t("Status")}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departmentlist?.Departments?.length > 0 ? (
                departmentlist?.Departments?.map((row) => (
                  <TableRow key={row.DepartmentID}>
                    <TableCell>{row?.DepartmentName}</TableCell>
                    <TableCell>
                      {row?.OrganizationStructureName || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Box sx={getStatusStyle(row?.IsActive)}>
                        {row?.IsActive ? t("active") : t("inactive")}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setOpen(!open);
                          setEditdata(row);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setAlert(!Alert);
                          setEditdata(row);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Nodata image={true} height={500} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <NewDepartment
          open={open}
          onClose={onClose}
          editdata={editdata}
          OrganizationStructureName={departmentlist?.OrganizationStructureName}
        />
        <DeleteConfirmationPopup
          open={Alert}
          onClose={() => {
            setAlert(!Alert);
          }}
          onConfirm={() => {
            onConfirm();
          }}
          title={t("deleteModal.deleteConfirmation")}
        />
      </Box>
    </>
  );
};

export default Department;
