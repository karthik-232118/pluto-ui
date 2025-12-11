import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateConfigData } from "../../../store/flow/slice";

export default function DataTableProperties() {
  const { id } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const [isSorceInput, setIsSourceInput] = useState(false);
  const [sourceInput, setSourceInput] = useState("");
  const [callbackUrl, setCallbackUrl] = useState(
    configData[id].linkUrl ? configData[id].callbackUrl : ""
  );
  const [sourceTitle, setSourceTitle] = useState(
    configData[id]?.title ? configData[id]?.title : "External Forms"
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const param = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      setCallbackUrl(
        "http://3.144.118.25:4311/v1/Zg5YScNcFY1s2lX/" + param?.id + "/" + id
      );
    }
  }, [nodeData[id], id]);

  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: sourceTitle,
          callbackUrl,
        },
      })
    );
  }, [sourceTitle, callbackUrl]);

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          justifyContent: "space-between",
        }}
      >
        <h1>Customize Table Properties Here</h1>
      </Box>
    </Box>
  );
}
