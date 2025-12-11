import {
  Box,
  Divider,
  FormGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";
import { useParams } from "react-router-dom";

export default function WebHookRecieveHttp() {
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
    <>
      <Divider sx={{ marginY: 2 }} />
      <FormGroup>
        <Typography variant="caption">Title</Typography>
        <TextField
          fullWidth
          value={sourceTitle}
          onChange={(e) => setSourceTitle(e.target.value)} // Handle title changes
          placeholder="Enter Title here"
          className="text_input_workflow"
        />
      </FormGroup>
      <Divider sx={{ marginY: 2 }} />
      <FormGroup>
        <Typography variant="caption">Webhook URL</Typography>
        <Tooltip
          title={tooltipOpen ? "Copied!" : "Click to Copy"}
          placement="top"
        >
          <TextField
            fullWidth
            value={callbackUrl}
            onClick={(e) =>
              navigator.clipboard.writeText(e.target.value).then(() => {
                setTooltipOpen(true);
                setTimeout(() => setTooltipOpen(false), 1000);
              })
            }
            placeholder="Webhook URL here"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ cursor: "pointer" }}
          />
        </Tooltip>
      </FormGroup>
    </>
  );
}
