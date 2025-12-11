import { useState } from "react";
import bg from "../../assets/svg/common/bg.svg";
import { useDispatch, useSelector } from "react-redux";
import { frontendState } from "../../store/presist/action";
import { useNavigate } from "react-router";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import backButton from "../../assets/svg/TrainingSimulation/BackButton.svg";
import PropTypes from "prop-types";
import { AddDocumentReadingTimingApi } from "../../services/elements/Elements";

const Breadcrumbs = ({
  bredcrumbs,
  folders = [],
  handleFolderClick,
  isBack,
  addNew,
  handleBackButtonClick,
  documentData,
}) => {
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const userRole = localStorage.getItem("user_type");
  const myTask = localStorage.getItem("my_task");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Helper to get reading stats for the current document
  const getReadingStats = () => {
    if (!documentData?.DocumentID || !documentData?.DocumentName) return null;
    const history = JSON.parse(
      localStorage.getItem("documentViewingHistory") || "[]"
    );
    console.log("Document viewing history:", history);
    const stats = history.find(
      (item) => item.documentId === documentData.DocumentID
    );
    console.log("Found stats for current document:", stats);
    if (!stats) return null;
    // Use timeSpentBreakdown for more accurate timing
    // Convert total seconds into h:m:s format
    const totalSeconds = stats.timeSpentBreakdown?.totalSeconds || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const days = 0; // We'll only use hours, minutes, and seconds
    return {
      DocumentID: documentData.DocumentID,
      NoOfPageRead: Array.isArray(stats.pagesViewed)
        ? stats.pagesViewed.length
        : 0,
      Days: days,
      Hours: hours,
      Minutes: minutes,
      Seconds: seconds,
    };
  };

  const handleClick = async (path) => {
    if (documentData) {
      const readingStats = getReadingStats();
      if (readingStats) {
        try {
          await AddDocumentReadingTimingApi(readingStats);
        } catch (e) {
          // Optionally handle error
        }
      }
      handleBackButtonClick();
      return;
    }

    setLoading(true);
    const currentUrl = window.location.pathname;
    const newPath = currentUrl.includes("/view")
      ? currentUrl.replace("/view", "")
      : currentUrl;
    navigate(newPath);
    const data = {
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: path,
    };
    dispatch(frontendState(data));
    if (folders.length > 0) {
      const folder = folders?.find((folder) => folder?.ContentID === path);
      handleFolderClick(folder);
    }
  };

  const handleBackClick = async (e) => {
    if (documentData) {
      // If there's document data, trigger the exit modal
      // Call API before triggering exit modal
      const readingStats = getReadingStats();
      if (readingStats) {
        try {
          await AddDocumentReadingTimingApi(readingStats);
        } catch (e) {
          // Optionally handle error
        }
      }
      handleBackButtonClick(e);
      return;
    }
    // Otherwise proceed with normal back navigation
    navigate(-1);
  };

  // Function to normalize breadcrumbs data structure
  const normalizeBreadcrumbs = (crumbs) => {
    if (!crumbs || crumbs.length === 0) return [];

    const isNewStructure = crumbs[0].ContentID !== undefined;

    if (isNewStructure) {
      return crumbs.map((item) => ({
        breadcrumbId: item.ContentID,
        breadcrumbName: item.ContentName,
        level: item.depth,
      }));
    }

    return crumbs.map((item) => ({
      ...item,
      level: item.level || 0,
    }));
  };

  const normalizedBreadcrumbs = normalizeBreadcrumbs(bredcrumbs);
  const sortedBreadcrumbs = [...normalizedBreadcrumbs].sort(
    (a, b) => (b.level ?? 0) - (a.level ?? 0)
  );

  const isProcessOwnerOrAdmin =
    (userRole === "ProcessOwner" || userRole === "Admin") &&
    (!myTask || myTask !== "EndUser");

  return (
    <div
      className="breadcrumbs-container"
      style={{
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        width: "99.6%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100",
          alignItems: "center",
        }}
      >
        {isBack && (
          <img
            src={backButton}
            alt="Back Button"
            className="back-button"
            onClick={handleBackClick}
            style={{ cursor: "pointer" }}
          />
        )}
        <div>
          {sortedBreadcrumbs.map((item, index) => (
            <div key={index} style={{ display: "inline" }}>
              {item?.breadcrumbId && index < sortedBreadcrumbs.length - 1 ? (
                <Typography
                  onClick={() => handleClick(item?.breadcrumbId)}
                  style={{
                    cursor: "pointer",
                    margin: "0 8px",
                    color: "#020617",
                    fontWeight: 400,
                  }}
                  variant="caption1"
                >
                  {loading && index === sortedBreadcrumbs?.length - 1 ? (
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  ) : (
                    item?.breadcrumbName
                  )}
                </Typography>
              ) : (
                <Typography
                  variant="caption1"
                  style={{
                    margin: "0 8px",
                    color: "#020617",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item?.breadcrumbName}
                </Typography>
              )}
              {index < sortedBreadcrumbs?.length - 1 && (
                <span className="bg-gap">
                  <img
                    src={bg}
                    alt=""
                    style={{
                      marginLeft: "8px",
                      verticalAlign: "top",
                      position: "relative",
                      top: "4px",
                    }}
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {isProcessOwnerOrAdmin && addNew && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          {addNew}
        </Box>
      )}
    </div>
  );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
  bredcrumbs: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        breadcrumbId: PropTypes.string,
        breadcrumbName: PropTypes.string.isRequired,
        level: PropTypes.number,
      })
    ),
    PropTypes.arrayOf(
      PropTypes.shape({
        ContentID: PropTypes.string,
        ParentContentID: PropTypes.string,
        ContentName: PropTypes.string.isRequired,
        ModuleTypeID: PropTypes.string,
        depth: PropTypes.number,
      })
    ),
  ]).isRequired,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      ContentID: PropTypes.string.isRequired,
      ContentName: PropTypes.string.isRequired,
    })
  ),
  handleFolderClick: PropTypes.func,
  isBack: PropTypes.bool,
  addNew: PropTypes.node,
  handleBackButtonClick: PropTypes.func,
  documentData: PropTypes.object,
};

Breadcrumbs.defaultProps = {
  folders: [],
  isBack: false,
  addNew: null,
  handleBackButtonClick: () => {},
  documentData: null,
};
