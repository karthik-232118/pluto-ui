import { Box, Modal } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  // height: "95vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "18px",
  outline: "none",
};

const inputStyle = {
  width: "100%",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const WorkflowSteps = ({ open, setOpen }) => {
  return (
    <Modal open={open} >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            height: "40px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={labelStyle}>Workflow Steps</Box>
        </Box>
        <Box></Box>
      </Box>
    </Modal>
  );
};

export default WorkflowSteps;
