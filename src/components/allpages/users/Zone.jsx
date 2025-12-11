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
import { deleteZone, GetZone } from "../../../store/enterprise/action";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmationPopup from "../../allpages/masterpopups/DeleteConfirmationPopup";
import AddIcon from "../../../assets/svg/uesrmanagement/AddIcon.svg";
import NewZone from "../masterpopups/NewZone";
import Nodata from "../masterpopups/Nodata";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";

const getStatusStyle = (status) => ({
  color: status ? "#027A48" : "#B42318",
  backgroundColor: status ? "#ECFDF3" : "#FEF3F2",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

const Zone = () => {
  const { t } = useTranslation();
  const disptach = useDispatch();
  const { zonelist } = useSelector((state) => state.enterprise);
  const [open, setOpen] = useState(false);
  const [editdata, setEditdata] = useState(null);
  const [Alert, setAlert] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    disptach(GetZone());
  }, []);

  const onConfirm = () => {
    const payload = {
      OrganizationStructureID: editdata?.OrganizationStructureID,
    };
    disptach(deleteZone(payload));
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
            {t("zoneManagement")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("zoneList")}
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
          {t("newZone")}
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
        <Divider sx={{ marginTop: 2 }} />
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 800,
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
                <TableCell>{t("title")}</TableCell>
                <TableCell>{t("status")}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zonelist?.length > 0 ? (
                zonelist?.map((row) => (
                  <TableRow key={row.OrganizationStructureID}>
                    <TableCell>{row?.OrganizationStructureName}</TableCell>
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
        <NewZone open={open} onClose={onClose} editdata={editdata} />
      </Box>
    </>
  );
};

export default Zone;
