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
  Card,
  Divider,
} from "@mui/material";
import {
  // Search,
  Delete,
  Edit,
} from "@mui/icons-material";

import {
  deletenterprises,
  Getentrprise,
} from "../../../store/enterprise/action";
import { useDispatch, useSelector } from "react-redux";
import Enterprises from "../../allpages/masterpopups/Enterprises";
import DeleteConfirmationPopup from "../../allpages/masterpopups/DeleteConfirmationPopup";
import AddIcon from "../../../assets/svg/uesrmanagement/AddIcon.svg";

import Nodata from "../../allpages/masterpopups/Nodata";
import { useTranslation } from "react-i18next";
import InfoEnterprises from "../masterpopups/InfoEnterprises";
import AccessDenied from "../../accessDenied/AccessDenied";
import { useTheme } from "@mui/styles";

const getStatusStyle = (status) => ({
  color: status ? "#027A48" : "#B42318",
  backgroundColor: status ? "#ECFDF3" : "#FEF3F2",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

const EnterprisesList = () => {
  const { t } = useTranslation();
  const disptach = useDispatch();
  const theme = useTheme();
  const { enterpriselist } = useSelector((state) => state.enterprise);
  const [open, setOpen] = useState(false);
  const [editdata, setEditdata] = useState(null);
  const [Alert, setAlert] = useState(false);
  const bgColor = theme.palette.primary.main;

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = () => {
    const payload = {};
    disptach(Getentrprise(payload));
  };
  const onConfirm = () => {
    const payload = {
      OrganizationStructureID: editdata?.OrganizationStructureID,
    };
    disptach(deletenterprises(payload));
    setAlert(false);
    setEditdata(null);
  };
  const onClose = () => {
    setOpen(false);
    handleFetchData();
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
            {t("enterprisesManagement")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("listEnterprises")}
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
          {t("newEnterprise")}
        </Button>
      </Box>
      <Card
        sx={{
          padding: "20px",
          backgroundColor: theme.palette.background.default,
          margin: "25px",
          borderRadius: "8px",
        }}
      >
        <Divider sx={{ marginTop: 2 }} />
        {/* Table */}
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
                backgroundColor: (theme) => {
                  theme.palette.background.default;
                },
                zIndex: 1,
              }}
            >
              <TableRow>
                <TableCell>{t("table.title")}</TableCell>
                <TableCell>{t("table.email")}</TableCell>
                {/* <TableCell>Description</TableCell> */}
                <TableCell>{t("table.status")}</TableCell>
                <TableCell>{t("table.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enterpriselist?.length > 0 ? (
                enterpriselist?.map((row) => (
                  <TableRow key={row.OrganizationStructureID}>
                    <TableCell>{row?.OrganizationStructureName}</TableCell>
                    <TableCell>
                      {row?.OrganizationStructureEmail || "N/A"}
                    </TableCell>
                    {/* <TableCell>{row?.OrganizationStructureDescription}</TableCell> */}
                    <TableCell>
                      <Box sx={getStatusStyle(row?.IsActive)}>
                        {row?.IsActive ? t("active") : t("inactive")}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <InfoEnterprises />
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

        <Enterprises open={open} onClose={onClose} editdata={editdata} />
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
      </Card>
    </>
  );
};

export default EnterprisesList;
