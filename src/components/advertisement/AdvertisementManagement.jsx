import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
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
import { Search, Delete, Edit } from "@mui/icons-material";
import {
  GetAdvertisement,
  deleteAdvertisement,
} from "../../store/Advertisement/action";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "../../assets/svg/uesrmanagement/AddIcon.svg";
import DeleteConfirmationPopup from "../allpages/masterpopups/DeleteConfirmationPopup";
import AddNewAdd from "./AddNewAdd";
import Nodata from "../allpages/masterpopups/Nodata";
import moment from "moment";
import { dateformatter } from "../../utils";
import { useTranslation } from "react-i18next";
import AccessDenied from "../accessDenied/AccessDenied";
import { useTheme } from "@mui/styles";

const getStatusStyle = (status) => ({
  color: status ? "#027A48" : "#B42318",
  backgroundColor: status ? "#ECFDF3" : "#FEF3F2",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

const AdvertisementManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.advertisement);
  const [open, setOpen] = useState(false);
  const [editdata, setEditdata] = useState(null);
  const [Alert, setAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0); // New state for total count

  useEffect(() => {
    const payload = {
      SearchText: search,
      Limit: limit,
      Page: page,
    };
    dispatch(GetAdvertisement(payload));
  }, [search, limit, page]);

  const onConfirm = async () => {
    const pagination = {
      SearchText: search,
      Limit: limit,
      Page: page,
    };
    const payload = {
      AdvertisementID: editdata?.AdvertisementID,
    };
    dispatch(deleteAdvertisement({ payload, pagination }));
    setAlert(false);
    setEditdata(null);
  };

  const onClose = () => {
    setOpen(false);
    setEditdata(null);
  };

  const handleNext = () => {
    if (page < Math.ceil(totalCount / limit)) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    setTotalCount(data?.count);
  }, [data]);

  const userType = localStorage.getItem("user_type");
  if (userType === "EndUser" || userType === "ProcessOwner") {
    return <AccessDenied />;
  }

  return (
    <>
      <Card
        sx={{
          padding: "20px",
          backgroundColor: (theme) => {
            theme.palette.background.default;
          },
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
        >
          <Box>
            <Typography variant="h6" style={{ fontWeight: "500" }}>
              {t("advertisement_management")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("advertisement_list_description")}
            </Typography>
          </Box>
          <Box sx={{ gap: "10px", display: "flex" }}>
            <TextField
              placeholder={t("search_placeholder")}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "250px",
                height: "44px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  borderColor: "#D0D5DD",
                  height: "44px",
                  "& fieldset": {
                    borderColor: "#D0D5DD",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D0D5DD",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#D0D5DD",
                  },
                },
              }}
            />
            <Button
              sx={{
                height: "40px",
                textTransform: "none",
              }}
              variant="contained"
              size="small"
              endIcon={<img src={AddIcon} alt="Add" />}
              onClick={() => setOpen(true)}
            >
              {t("new_ad")}
            </Button>
          </Box>
        </Box>
        <Divider sx={{ marginTop: 2 }} />
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 800, overflowY: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: (theme) => {
                    theme.palette.background.default;
                  },
                  zIndex: 1,
                }}
              >
                <TableCell>{t("title")}</TableCell>
                <TableCell>{t("posted_date")}</TableCell>
                <TableCell>{t("expiry_date")}</TableCell>
                <TableCell>{t("Status")}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                position: "relative",
              }}
            >
              {data?.rows?.length > 0 ? (
                data?.rows?.map((row) => (
                  <TableRow key={row?.AdvertisementID}>
                    {/* <TableCell>{row?.AdvertisementID}</TableCell> */}
                    <TableCell>{row?.AdvertisementTitle}</TableCell>
                    <TableCell>
                      {row?.CreatedDate
                        ? dateformatter(row?.CreatedDate)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row?.ExpireDate ? dateformatter(row?.ExpireDate) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Box sx={getStatusStyle(row?.IsActive)}>
                        {row?.IsActive ? t("active") : t("inactive")}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setOpen(true);
                          setEditdata(row);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setAlert(true);
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
                  <TableCell colSpan={7}>
                    <Nodata image={true} height={500} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <div>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={handlePrevious}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outlined"
              disabled={page >= Math.ceil(totalCount / limit)}
              onClick={handleNext}
            >
              {t("next")}
            </Button>
          </div>
          <div>
            <Typography sx={{ color: "#344054" }}>
              {t("page")} {page} {t("of")} {Math.ceil(totalCount / limit)}
            </Typography>
          </div>
        </Box>
        <AddNewAdd
          open={open}
          onClose={onClose}
          editdata={editdata}
          pagination={{
            SearchText: search,
            Limit: limit,
            Page: page,
          }}
        />
        <DeleteConfirmationPopup
          open={Alert}
          onClose={() => setAlert(false)}
          onConfirm={onConfirm}
          title={t("deleteModal.deleteRoleConfirmation")}
        />
      </Card>
    </>
  );
};

export default AdvertisementManagement;
