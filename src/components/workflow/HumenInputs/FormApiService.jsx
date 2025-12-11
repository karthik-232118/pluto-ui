import {
  // Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";
import AutoComplateForms from "./AutoComplateForms";

export default function FormApiService() {
  const { id } = useSelector((state) => state.workflow.data);
  const configData = useSelector((state) => state.workflow.configData);
  const [linkUrl, setLinkUrl] = useState(
    configData[id].linkUrl ? configData[id].linkUrl : ""
  );
  const flowDataById = useSelector((state) => state.workflow.getflowdatafromId);
  const [callbackUrl, setCallbackUrl] = useState(
  process.env.VITE_FLOW_BASE_FORM_URL +
    flowDataById?.FlowID +
    "/" +
    id
  );

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.workflow);

  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const [title, setTitle] = useState(configData[id]?.title); // State for the title field
  const [isEmailShared, setIsEmailShared] = useState(
    configData[id]?.isEmailShared || true
  );
  // const [ownerData, setOwnerData] = useState(configData[id]?.owner || []);
  const [selectedUserIds, setSelectedUserIds] = useState(
    configData[id]?.owner?.map((user) => user.UserID) || []
  );
  const [startDate, setStartDate] = useState(configData[id]?.startDate || "");
  const [endDate, setEndDate] = useState(configData[id]?.endDate || "");
  const [notiFyAfter, setNotifyAfter] = useState(configData[id]?.notifyAfter);
  const [isSkipable, setIsSkipable] = useState(
    configData[id]?.isSkipable || false
  );
  const [remindBefore, setRemindBefore] = useState(
    configData[id]?.remindBefore || 0
  );
  const [parentLastDate, setParentLastDate] = useState("");

  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title,
          isEmailShared: isEmailShared,
          owner: Array.isArray(selectedUserIds)
            ? userList.filter((user) => selectedUserIds.includes(user.UserID))
            : userList.filter((user) => user.UserID === selectedUserIds),
          startDate:
            new Date().toISOString().slice(0, 10) === startDate.slice(0, 10)
              ? new Date().toISOString()
              : startDate,
          endDate: endDate
            ? new Date(
              new Date(endDate).setHours(23, 59, 59, 999)
            ).toISOString()
            : null,
          notiFyAfter: notiFyAfter ? notiFyAfter : 0,
          remindBefore: remindBefore ? remindBefore : 0,
          isSkipable,
          linkUrl,
          callbackUrl,
        },
      })
    );
  }, [
    title,
    isEmailShared,
    selectedUserIds,
    startDate,
    endDate,
    notiFyAfter,
    isSkipable,
    linkUrl,
    callbackUrl,
  ]);

  useEffect(() => {
    let latestDate = flowDataById.AccessStartDate;
    if (nodeData[id]) {
      for (const el of nodeData[id]) {
        for (const [k, v] of Object.entries(configData)) {
          if (el?.data?.parentIds?.some((x) => x.toString() === k.toString())) {
            if (
              (v.type === "Create Form" || v.type === "External Forms") &&
              latestDate < v.endDate
            ) {
              latestDate = v.endDate;
            }
          }
        }
      }
    }
    setParentLastDate(latestDate);
  }, [nodeData[id], configData]);

  return (
    <>
      <FormGroup>
        <Typography variant="caption">Title</Typography>
        <TextField
          fullWidth
          required={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text_input_workflow"
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption">
          Start Date <span className="error">*</span>
        </Typography>
        <TextField
          fullWidth
          className="text_input_workflow"
          type="date"
          defaultValue={
            startDate ? new Date(startDate).toISOString().slice(0, 10) : null
          }
          onChange={(e) => setStartDate(e.target.value)}
          inputProps={{
            min: parentLastDate
              ? parentLastDate.slice(0, 10)
              : flowDataById?.AccessStartDate
                ? flowDataById?.AccessStartDate?.split("T")[0]
                : new Date().toISOString().slice(0, 10),
            max: flowDataById?.AccessEndDate
              ? flowDataById?.AccessEndDate?.split("T")[0]
              : null,
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption">End Date</Typography>
        <TextField
          fullWidth
          type="date"
          defaultValue={
            endDate ? new Date(endDate).toISOString().slice(0, 10) : null
          }
          className="text_input_workflow"
          disabled={!startDate}
          onChange={(e) => setEndDate(e.target.value)}
          inputProps={{
            min: startDate
              ? startDate
              : flowDataById?.AccessStartDate
                ? flowDataById?.AccessStartDate?.split("T")[0]
                : new Date().toISOString().slice(0, 10),
            max: flowDataById?.AccessEndDate
              ? flowDataById?.AccessEndDate?.split("T")[0]
              : null,
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption">Notify After (in Hours)</Typography>
        <TextField
          fullWidth
          type="number"
          defaultValue={notiFyAfter}
          onChange={(e) => setNotifyAfter(Number(e.target.value))}
          className="text_input_workflow"
        />
      </FormGroup>
      {endDate && <FormGroup>
        <Typography variant="caption" className="form_lable">
          Reminder Before (in Days)
        </Typography>
        <TextField
          className="text_input_workflow"
          type="number"
          defaultValue={remindBefore}
          onChange={(e) => setRemindBefore(Number(e.target.value))}
        />
      </FormGroup>}
      <Divider sx={{ marginY: 2 }} />
      <FormControlLabel
        sx={{
          ".MuiFormControlLabel-label": {
            marginBottom: "0",
            fontWeight: "500",
            fontSize: "12px",
          },
        }}
        control={
          <Checkbox
            checked={isEmailShared}
            onChange={(e) => {
              setIsEmailShared(e.target.checked);
            }}
            sx={{
              fontWeight: "500",
              fontSize: "12px",
              padding: "0.5rem", // Adjust padding if necessary
            }}
            disabled
          />
        }
        label="Share Via Email"
      />
      {isEmailShared && (
        <Box>
          <Box>
            <AutoComplateForms
              userList={userList}
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
            />
          </Box>
          <Divider sx={{ marginY: 2 }} />
        </Box>
      )}
      <FormGroup>
        <Typography variant="caption">
          Form URL <span className="error">*</span>
        </Typography>
        <TextField
          fullWidth
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Url of the form"
          className="text_input_workflow"
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption">Call Back Url</Typography>
        <Tooltip
          title={tooltipOpen ? "Copied!" : "Click to Copy"}
          placement="top"
        >
          <TextField
            value={callbackUrl}
            onClick={(e) =>
              navigator.clipboard.writeText(e.target.value).then(() => {
                setTooltipOpen(true);
                setTimeout(() => setTooltipOpen(false), 1000);
              })
            }
            placeholder="callback URL here"
            className="text_input_workflow"
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
