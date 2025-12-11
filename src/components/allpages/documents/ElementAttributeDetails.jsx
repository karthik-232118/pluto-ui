import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  ViewElementAttributeType,
  listProcessOwner,
  listProcessOwnerAndEndUser,
} from "../../../services/documentModules/DocumentsModule";
import { useHeadingBgColor } from "../../useHeadingBgColor";

const ElementAttributeDetails = ({ row }) => {
  const { t } = useTranslation();
  const [elementAttributeData, setElementAttributeData] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState(
    []
  );
  const [loading, setLoading] = useState(false); 

  const bgColor = useHeadingBgColor();

  useEffect(() => {
    const fetchElementAttributeData = async () => {
      setLoading(true); 
      try {
        const payload = {
          ElementAttributeTypeID: row.ElementAttributeTypeID,
        };

        const response = await ViewElementAttributeType(payload);
        console.log(
          "ElementAttributeTypeID API Response:",
          response?.data?.data?.elementAttribute
        );
        console.log("ElementAttributeTypeID:", row.ElementAttributeTypeID);
        setElementAttributeData(response?.data?.data?.elementAttribute);
      } catch (error) {
        console.error("Error fetching element attribute data:", error);
      } finally {
        setLoading(false); 
      }
    };

    const fetchReviewers = async () => {
      try {
        const response = await listProcessOwner();
        if (response?.status === 200) {
          setReviewers(response.data?.data?.userList || []);
        }
      } catch (error) {
        console.error("Failed to load reviewers:", error);
      }
    };

    const FetchlistProcessOwnerAndEndUser = async () => {
      try {
        const response = await listProcessOwnerAndEndUser();
        if (response?.status === 200) {
          setProcessOwnerAndEndUserList(response?.data?.data?.userList || []);
        }
      } catch (error) {
        console.error("Failed to load process owners and end users:", error);
      }
    };

    if (row.ElementAttributeTypeID) {
      fetchElementAttributeData();
      fetchReviewers();
      FetchlistProcessOwnerAndEndUser();
    }
  }, [row.ElementAttributeTypeID]);

  const getReviewerNameById = (id) => {
    const reviewer = reviewers.find((r) => r.UserID === id);
    const userDetail = reviewer?.UserDetail;

    if (!reviewer) return id;

    const userName = reviewer.UserName || "";
    const firstName = userDetail?.UserFirstName || "";
    const lastName = userDetail?.UserLastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName ? `${userName} (${fullName})` : userName || id;
  };

  const getProcessOwnerOrEndUserNameById = (id) => {
    const user = processOwnerAndEndUserList.find((u) => u.UserID === id);
    const userDetail = user?.UserDetail;

    if (!user) return id;

    const userName = user.UserName || "";
    const firstName = userDetail?.UserFirstName || "";
    const lastName = userDetail?.UserLastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName ? `${userName} (${fullName})` : userName || id;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);

    return `${day} ${month} ${year}`;
  };

  const FieldComponent = ({
    label,
    value,
    isBoolean = false,
    isDate = false,
  }) => (
    <Paper
      elevation={1}
      style={{
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e0e7ef",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Typography
        variant="subtitle2"
        style={{
          color: bgColor || "#1976d2",
          fontWeight: 600,
          fontSize: "0.875rem",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        style={{
          color: "#2c3e50",
          fontWeight: 500,
          fontSize: "1rem",
          lineHeight: 1.5,
        }}
      >
        {isBoolean
          ? value
            ? "Yes"
            : "No"
          : isDate && value
          ? formatDate(value)
          : value || "N/A"}
      </Typography>
    </Paper>
  );

  const UserChipList = ({ users, getUserName, title }) => (
    <Grid item xs={12}>
      <Paper
        elevation={2}
        style={{
          padding: "20px",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${
            bgColor || "#1976d2"
          }15 0%, #ffffff 100%)`,
          border: `1px solid ${bgColor || "#1976d2"}20`,
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: bgColor || "#1976d2",
            fontWeight: 600,
            marginBottom: "16px",
            fontSize: "1.125rem",
          }}
        >
          {title}
        </Typography>
        <Box style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {users.map((user, index) => (
            <Chip
              key={index}
              label={getUserName(user)}
              style={{
                backgroundColor: bgColor || "#1976d2",
                color: "white",
                fontWeight: 500,
                fontSize: "0.875rem",
                padding: "4px 8px",
                borderRadius: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box
      style={{
        padding: "24px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {loading ? ( 
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Card
          elevation={3}
          style={{
            borderRadius: "16px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid #e0e7ef",
            overflow: "hidden",
          }}
        >
          <CardContent style={{ padding: "32px" }}>

            {row.CreatedDate && (
              <Box style={{ marginBottom: "32px" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Created Date"
                      value={row.CreatedDate}
                      isDate={true}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {elementAttributeData && (
              <>
                <Grid container spacing={3} style={{ marginBottom: "32px" }}>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Description"
                      value={elementAttributeData.Description}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Self Approved"
                      value={elementAttributeData.SelfApproved}
                      isBoolean={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Review Required"
                      value={elementAttributeData.IsReview}
                      isBoolean={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Approval Required"
                      value={elementAttributeData.IsApproval}
                      isBoolean={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Escalation"
                      value={elementAttributeData.IsEscalation}
                      isBoolean={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Auto Publish"
                      value={elementAttributeData.IsAutoPublish}
                      isBoolean={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Downloadable"
                      value={elementAttributeData.IsDownloadable}
                      isBoolean={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Has Expiry"
                      value={elementAttributeData.IsExpiry}
                      isBoolean={true}
                    />
                  </Grid>
                  {elementAttributeData.IsEscalation && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FieldComponent
                          label="Escalation Type"
                          value={elementAttributeData.EscalationType}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FieldComponent
                          label="Escalation After"
                          value={elementAttributeData.EscalationAfter}
                        />
                      </Grid>
                    </>
                  )}
                  {elementAttributeData.IsExpiry &&
                    elementAttributeData.ExpiryDate && (
                      <Grid item xs={12} sm={6}>
                        <FieldComponent
                          label="Expiry Date"
                          value={elementAttributeData.ExpiryDate}
                          isDate={true}
                        />
                      </Grid>
                    )}

                  <Grid item xs={12} sm={6}>
                    <FieldComponent
                      label="Review Notification"
                      value={`${elementAttributeData.ReviewNotificationInterval} ${elementAttributeData.ReviewNotificationType}`}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  {elementAttributeData.Reviewers &&
                    elementAttributeData.Reviewers.length > 0 && (
                      <UserChipList
                        users={elementAttributeData.Reviewers}
                        getUserName={getReviewerNameById}
                        title="Reviewers"
                      />
                    )}

                  {elementAttributeData.Approvers &&
                    elementAttributeData.Approvers.length > 0 && (
                      <UserChipList
                        users={elementAttributeData.Approvers}
                        getUserName={getProcessOwnerOrEndUserNameById}
                        title="Approvers"
                      />
                    )}

                  {elementAttributeData.EscalationUsers &&
                    elementAttributeData.EscalationUsers.length > 0 && (
                      <UserChipList
                        users={elementAttributeData.EscalationUsers}
                        getUserName={getReviewerNameById}
                        title="Escalation Users"
                      />
                    )}

                  {elementAttributeData.Stakeholders &&
                    elementAttributeData.Stakeholders.length > 0 && (
                      <UserChipList
                        users={elementAttributeData.Stakeholders}
                        getUserName={getReviewerNameById}
                        title="Stakeholders"
                      />
                    )}

                  {elementAttributeData.StakeHolderEscalationUsers &&
                    elementAttributeData.StakeHolderEscalationUsers.length >
                      0 && (
                      <UserChipList
                        users={elementAttributeData.StakeHolderEscalationUsers}
                        getUserName={getProcessOwnerOrEndUserNameById}
                        title="Stakeholder Escalation Users"
                      />
                    )}

                  {elementAttributeData.CoOwnerUserID &&
                    elementAttributeData.CoOwnerUserID.length > 0 && (
                      <UserChipList
                        users={elementAttributeData.CoOwnerUserID}
                        getUserName={getReviewerNameById}
                        title="Co-Owners"
                      />
                    )}
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ElementAttributeDetails;
