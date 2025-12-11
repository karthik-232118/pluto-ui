// components/layouts/NoLayout.js
import React from "react";
import { Box } from "@mui/material";

const NoLayout = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F6FB" }}>
      {children}
    </Box>
  );
};

export default NoLayout;
