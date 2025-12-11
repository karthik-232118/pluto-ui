import  { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Avatar,
  List,
  ListItem,
  TextField,
  Tooltip,
  tooltipClasses,
  styled,
} from "@mui/material";
import DetailsIcon from "../../../assets/svg/D&A/info.svg";
import ActivityIcon from "../../../assets/svg/D&A/activity.svg";
import "./RightSection.css";
import calendar from "../../../assets/svg/VideoSimulation/calendar.svg";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    padding: "15px",
    margin: "1rem",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}));

const RightSection = ( ) => {
  const [selectedTab, setSelectedTab] = useState("details");

  const HandleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Box className="right-content">
      <Box className="tab-icons">
        <CustomTooltip title="File Info" placement="left" arrow>
          <IconButton
            onClick={() => HandleTabChange("details")}
            color={selectedTab === "details" ? "#3D54CD" : "default"}
          >
            <img
              src={DetailsIcon}
              alt="Details"
              style={{
                filter:
                  selectedTab === "details"
                    ? "invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)"
                    : "none",
              }}
            />
          </IconButton>
        </CustomTooltip>
        <CustomTooltip title="Activity" placement="left" arrow>
          <IconButton
            onClick={() => HandleTabChange("activity")}
            color={selectedTab === "activity" ? "#3D54CD" : "default"}
            sx={{ marginTop: "1rem" }}
          >
            <img
              src={ActivityIcon}
              alt="Activity"
              style={{
                filter:
                  selectedTab === "activity"
                    ? "invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)"
                    : "none",
              }}
            />
          </IconButton>
        </CustomTooltip>
      </Box>

      {/* box-shadow: 20px 0px 26.6px 0px #9D9D9D40; */}

      <Divider
        orientation="vertical"
        // flexItem
        style={{
          color: "#F5F6FB",
          boxShadow: "20px 0px 26.6px 0px #9D9D9D40",
        }}
      />
      <Box className="tab-content">
        <Box className="tab-header" sx={{ margin: "1rem" }}>
          <Typography variant="h6" style={{ height: "24px" }}>
            {selectedTab === "details" ? "Details" : "Activity"}
          </Typography>
        </Box>
        {selectedTab === "details" ? (
          <Box>
            <div className="detail-section">
              <Typography style={{ color: "#64748B" }}>Uploaded By</Typography>
              <Box className="uploaded-by">
                <Avatar
                  sx={{ marginRight: 1, width: "26px", height: "26px" }}
                  src="path-to-salman-avatar.png"
                />
                <p>Salman Mohd</p>
              </Box>
              <Typography style={{ color: "#64748B", fontWeight: "400" }}>
                Uploaded on
              </Typography>
              <Box className="uploaded-on">
                <img src={calendar} alt="" style={{ marginRight: "0.3rem" }} />
                16/08/2024
              </Box>
            </div>
            <ListItem style={{ marginTop: "1rem" }}>
              <Typography style={{ fontWeight: "600" }}>
                Version Updates
              </Typography>
            </ListItem>
            <List style={{ fontSize: "14px" }}>
              <ListItem sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: "16px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#3D54CD",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      marginBottom: "8px",
                      boxShadow: "0 0 0 5px #DBEAFE",
                    }}
                  />
                  <Box
                    sx={{
                      height: "30px",
                      borderLeft: "2px solid #E2E8F0",
                      marginTop: "-8px",
                    }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }} style={{ marginTop: "-22px" }}>
                  <Typography style={{ marginTop: "14px" }}>
                    12 Aug 2022
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      marginTop: "8px",
                    }}
                  >
                    <Avatar
                      sx={{
                        marginRight: 1,
                        marginLeft: "-31px",
                        width: "24px",
                        height: "24px",
                        marginTop: "13px",
                      }}
                      src="path-to-jessica-avatar.png"
                    />
                    <Typography
                      sx={{
                        flexGrow: 1,
                        paddingTop: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Jessica Smith{" "}
                      <span style={{ color: "#3D54CD" }}>Version 1.3</span>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: "30px",
                      borderLeft: "2px solid #E2E8F0",
                      margin: "0px 0 0 -20px",
                    }}
                  />
                </Box>
              </ListItem>
              <ListItem
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginTop: "-18px",
                  marginLeft: "1px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: "16px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#64748B",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      marginBottom: "8px",
                    }}
                  />
                  <Box
                    sx={{
                      height: "30px",
                      borderLeft: "2px solid #E2E8F0",
                      marginTop: "-8px",
                    }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }} style={{ marginTop: "-22px" }}>
                  <Typography style={{ marginTop: "14px" }}>
                    12 Aug 2022
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      marginTop: "8px",
                    }}
                  >
                    <Avatar
                      sx={{
                        marginRight: 1,
                        marginLeft: "-31px",
                        width: "24px",
                        height: "24px",
                        marginTop: "13px",
                      }}
                      src="path-to-jessica-avatar.png"
                    />
                    <Typography
                      sx={{
                        flexGrow: 1,
                        paddingTop: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Jessica{" "}
                      <span style={{ color: "#94A3B8" }}>Version 1.2</span>
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            </List>
          </Box>
        ) : (
          <Box style={{ margin: "0 8px" }}>
            <TextField
              label="Add comment here..."
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{
                boxShadow: "0px 1px 2px 0px #1018280D",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  border: "1px solid #F5F6FB",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />

            <Box
              sx={{
                height: "30px",
                borderLeft: "2px solid #E2E8F0",
                marginLeft: "20px",
              }}
            />
            <Box style={{ display: "flex" }}>
              <Box
                sx={{
                  backgroundColor: "#64748B",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  marginLeft: "17px",
                }}
              />
              <p style={{ marginLeft: "15px", marginTop: "-10px" }}>
                12 Aug 2022
              </p>
            </Box>
            <Box
              sx={{
                height: "30px",
                borderLeft: "2px solid #E2E8F0",
                marginLeft: "20px",
                marginTop: "-22px",
              }}
            />
            <Avatar
              sx={{
                marginLeft: "9.5px",
                width: "24px",
                height: "24px",
                marginTop: "0px",
              }}
              src="path-to-jessica-avatar.png"
            />
            <p
              style={{
                marginLeft: "42px",
                marginTop: "-24px",
                fontWeight: "500",
              }}
            >
              Jessica Smith <span style={{ color: "#3D54CD" }}>Created</span>
            </p>
            <Box
              sx={{
                height: "30px",
                borderLeft: "2px solid #E2E8F0",
                marginLeft: "20px",
                marginTop: "-17px",
              }}
            />
            <Box
              sx={{
                backgroundColor: "#64748B",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                marginLeft: "17px",
              }}
            />
            <p style={{ marginLeft: "42px", marginTop: "-16px" }}>
              12 Aug 2022
            </p>
            <Box
              sx={{
                height: "30px",
                borderLeft: "2px solid #E2E8F0",
                marginLeft: "20px",
                marginTop: "-22px",
              }}
            />
            <Avatar
              sx={{
                marginLeft: "9.5px",
                width: "24px",
                height: "24px",
                marginTop: "0px",
              }}
              src="path-to-jessica-avatar.png"
            />
            <p
              style={{
                marginLeft: "42px",
                marginTop: "-24px",
                fontWeight: "500",
              }}
            >
              Robert Jr <span style={{ color: "#DA950D" }}>Review</span>
              <p
                style={{
                  marginTop: "0",
                  fontFamily: "var(--fontfamilysans)",
                  fontSize: "var(--fontsizexs)",
                  fontWeight: "400",
                  lineHeight: "var(--fontline-height4)",
                  letterSpacing: "var(--fontletter-spacingnormal)",
                  textAlign: "left",
                  width: "223px",
                  height: "48px",
                  gap: "0px",
                  opacity: "0px",
                  color: "#475467",
                }}
              >
                Lorem Ipsum doler siet Lorem Ipsum doler siet Lorem Ipsum
              </p>{" "}
            </p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RightSection;
