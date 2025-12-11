import { useState } from "react";
import { Box, Typography, Divider, Avatar, Button, Grid } from "@mui/material";
import { styled } from "@mui/styles";
import EditProfile from "./EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserData } from "../../../store/user/user";
import { BASE_URL } from "../../../config/urlConfig";
import { toast } from "react-toastify";
import { dateformatter } from "../../../utils";
import { useTranslation } from "react-i18next";

const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#F9FAFF",
  border: "1px solid #D0D7F0",
  borderRadius: "12px",
  padding: "24px",
  gap: "30px",
  height: "auto",
  marginTop: "24px",
  [theme.breakpoints.down("md")]: {
    padding: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "12px",
  },
}));
const AvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));
const InfoLabel = styled(Typography)(() => ({
  color: "#475467",
  borderLeft: "3px solid  #3B82F6",
  paddingLeft: "10px",
  fontSize: "16px",
}));
const GeneralTabContent = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const disptach = useDispatch();
  const { userdata } = useSelector((state) => state?.user);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = (data) => {
    const formDataToSend = new FormData();
    Object.keys(data).forEach((key) => {
      formDataToSend.append(key, data[key]);
    });

    disptach(UpdateUserData(formDataToSend))
      .unwrap()
      .then((response) => {
        setIsEditing(false);
        toast.success(response?.message || "Profile updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.error(
          error?.message || "Failed to update profile. Please try again.",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          }
        );
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "550" }}>
        {t("generalHeading")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#64748B", fontSize: "15px", fontWeight: "400" }}
      >
        {t("generalDescription")}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Profile Information Container */}
      {!isEditing ? (
        <ProfileContainer>
          <AvatarContainer>
            <Avatar
              alt={`${userdata?.UserFirstName} ${userdata?.UserLastName}`}
              src={
                userdata?.UserPhoto !== null &&
                userdata?.UserPhoto !== undefined &&
                `${BASE_URL}${userdata?.UserPhoto}`
              }
              sx={{
                width: 80,
                height: 80,
                marginRight: "16px",
                border: "3px solid #CEBDFF",
              }}
            />
            <Box sx={{ marginBottom: { xs: "8px", sm: 0 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "500", color: "#344054" }}
              >
                {`${userdata?.UserFirstName} ${userdata?.UserLastName}  ${
                  userdata?.UserMiddleName || ""
                }`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#8F69FC",
                  color: "#fff",
                  padding: "2px 15px",
                  borderRadius: "22px",
                  display: "inline-block",
                  marginTop: "2px",
                  fontSize: "12px",
                }}
              >
                {userdata?.UserType === "ProcessOwner"
                  ? "Process Owner"
                  : userdata?.UserType === "EndUser"
                  ? "End user"
                  : userdata?.UserType === "Admin"
                  ? "Admin"
                  : userdata?.UserType === "Auditor"
                  ? "Auditor"
                  : ""}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                marginLeft: { xs: 0, sm: "auto" },
                marginTop: { xs: "8px", sm: 0 },
                color: "#fff",
                width: { xs: "100%", sm: "auto" }, // Full width on small screens
                textTransform: "none",
              }}
              onClick={handleEditClick}
            >
              {t("editProfileButton")}
            </Button>
          </AvatarContainer>

          <Typography
            sx={{
              marginTop: "24px",
              color: "#64748B",
              fontWeight: "300",
              fontSize: "17px",
            }}
          >
            {t("personalInformationHeading")}
          </Typography>
          <Divider sx={{ my: 1, mb: 2 }} />
          <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {" "}
                {t("emailLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.UserEmail}{" "}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("locationLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {" "}
                  {userdata?.UserAddress}{" "}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("mobileNumberLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.UserPhoneNumber}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("dateOfBirthLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.UserDateOfBirth
                    ? dateformatter(userdata?.UserDateOfBirth)
                    : "N/A"}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("genderLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.Gender}{" "}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("userNameLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.UserName}{" "}
                </span>
              </InfoLabel>
            </Grid>
          </Grid>
          <Typography
            sx={{
              marginTop: "24px",
              color: "#64748B",
              fontWeight: "300",
              fontSize: "17px",
            }}
          >
            {t("additionalInformationHeading")}
          </Typography>
          <Divider sx={{ my: 1, mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("employeeCodeLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.UserEmployeeNumber}{" "}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("departmentLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.DepartmentName}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("unitLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.UnitName}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("zoneLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.ZoneName}
                </span>
              </InfoLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <InfoLabel sx={{ fontWeight: "400" }}>
                {t("roleLabel")}
                <br />
                <span style={{ color: "#000", fontWeight: "500" }}>
                  {userdata?.RoleName}
                </span>
              </InfoLabel>
            </Grid>
          </Grid>
        </ProfileContainer>
      ) : (
        <EditProfile
          handleCancel={handleCancel}
          handleSaveChanges={handleSaveChanges}
        />
      )}
    </Box>
  );
};

export default GeneralTabContent;
