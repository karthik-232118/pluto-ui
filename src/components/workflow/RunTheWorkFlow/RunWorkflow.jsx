import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Grid, styled, Typography } from "@mui/material";
// import bgimage from "../../../assets/svg/reactflow/reactflowbgimage.svg";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
// import TextSnippetIcon from "@mui/icons-material/TextSnippet";
// import RightSideRunflow from "./RightSideRunflow";
import Executions from "../Executions";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ExecuteFlow,
  ExecutionHistory,
  GettflowById,
} from "../../../store/flow/action";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: "270px",
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#EF6C0080",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#EF6C00",
  },
}));

const RunWorkflow = () => {

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Executions />
    </Box>
  );
};

export default RunWorkflow;
