import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropTypes from "prop-types";

const UpcomingTests = ({ dynamicDashboardData }) => {
  // Extracting the upcoming test data from dynamicDashboardData
  const UpcummingTest = dynamicDashboardData?.data?.UpcummingTest || [];
  console.log("UpcomingTestsData", UpcummingTest);

  return (
    <Card
      sx={{
        borderRadius: "12px",
        background: "linear-gradient(to right, #f8f6fc, #f8f6fc)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        height: "100%", // Match parent's height
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* CardContent for heading and subheading */}
      <CardContent sx={{ flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Upcoming Test & MCQ
        </Typography>
        <Typography variant="body2" sx={{ color: "#A6A9AC", mb: 2 }}>
          Upcoming test of month
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.80rem",
            mb: 1,
            borderTop: "1px solid #E0E0E0",
            borderBottom: "1px solid #E0E0E0",
            paddingY: 1.5,
            background: "#fff",
            color: "rgba(0, 0, 0, 0.6)",
            margin: "-15px",
            paddingLeft: "15px",
            marginTop: "15px",
          }}
        >
          TEST NAME
        </Typography>
      </CardContent>

      {/* Scrollable area for the tests list */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          // Hide scrollbar
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
        }}
      >
        {/* Conditionally render if no upcoming tests are found */}
        {UpcummingTest.length === 0 ? (
          <Box sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#A6A9AC" }}>
              No upcoming tests found.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {UpcummingTest.map((test, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  sx={{
                    paddingY: 1.5,
                    paddingX: 2,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500, color: "#2196F3" }}>
                        {test.ElementName}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                          mt: 0.5,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2">
                          Due on: <span style={{ color: "#000" }}>{new Date(test.DueDate).toLocaleString()}</span>
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <ChevronRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index !== UpcummingTest.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Card>
  );
};

export default UpcomingTests;

UpcomingTests.propTypes = {
  dynamicDashboardData: PropTypes.shape({
    data: PropTypes.shape({
      UpcummingTest: PropTypes.arrayOf(
        PropTypes.shape({
          ElementName: PropTypes.string.isRequired,
          DueDate: PropTypes.string.isRequired,
        })
      ),
    }),
  }),
};