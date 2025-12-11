import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { openSidbar, UpdateFLowPosition } from "../../store/flow/action";
import ServicesSendEmail from "./smtp/ServicesSenemail";
import ServicesCustomEmailApi from "./smtp/ServicesCustomEmailApi";
import HttpServices from "./https/services";
import TextInputServices from "./HumenInputs/services";
import IfElseServices from "./ifelse/service";
import CsvServies from "./csv/services";
import TextService from "./text/TextService";
import TextSplitService from "./text/TextSplitService";
import TextRemoveHTMLService from "./text/TextRemoveHTMLService";
import TextReplaceService from "./text/TextReplaceService";
import TextFindService from "./text/TextFindService";
import ServiceDynamic from "./HumenInputs/ServiceDynamic";
import OutputService from "./output/OutputService";
import FormApiService from "./HumenInputs/FormApiService";
import WebHookRecieveHttp from "./webhook/WebHookRecieveHttp";
import { updateConfig, updateStartNodeId } from "../../store/flow/slice";
import { useParams } from "react-router";
import UsbIcon from "@mui/icons-material/Usb";
// import UsbOffIcon from "@mui/icons-material/UsbOff";
import { geticons } from "../../utils";
import DataTableProperties from "./dataTable/DataTableProperties";

const RightSidebar = ({ open, nodes, edges, configData }) => {
  const { name, id } = useSelector((state) => state.workflow.data);
  const dispatch = useDispatch();
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const { startNodeId, getflowdatafromId } = useSelector(
    (state) => state.workflow
  );
// console.log(edges)
  const params = useParams();
  const toggleSidebar = () => {
    dispatch(
      openSidbar({
        name: null,
        open: false,
        openService: false,
      })
    );
  };
  useEffect(() => {
    if (getflowdatafromId?.StartNodeID) {
      dispatch(updateStartNodeId(getflowdatafromId?.StartNodeID));
    }
  }, [getflowdatafromId]);

  const submitData = async () => {
    const filter = Object.fromEntries(
      Object.entries(configData).filter(([key]) =>
        nodes.some((el) => el.id === key)
      )
    );
    await dispatch(updateConfig(filter));
    const res = await dispatch(
      UpdateFLowPosition({
        FlowID: params.id,
        FlowNodePositionDetails: nodes,
        FlowNodeEdgesDetails: edges,
        NodeConfigs: filter,
        StartNodeID: startNodeId,
        CreatedBy: localStorage.getItem("user_id"),
      })
    );
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        openSidbar({
          name: null,
          open: false,
          openService: false,
        })
      );
    }
  };

  return (
    <>
      {open && (
        <Box
          sx={{
            backgroundColor: "#fff",
            width: "340px",
            height: "auto",
          }}
        >
          <Box className="RightSide_Bar_Header_Section">
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={geticons(name)}
                alt={name}
                className="rightSide_Bar_icon"
              />
              <Typography variant="h6" className="RightSideBar_Heading">
                {name}
              </Typography>
            </div>
            <Typography>
              {/* {!!nodeData[id] ? ( */}
                <UsbIcon color="success" fontSize="large" />
              {/* ) : (
                <UsbOffIcon fontSize="large" />
              )} */}
            </Typography>
          </Box>
          <Box
            sx={{
              padding: "0 1rem",
            }}
          >
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
                  checked={startNodeId === id}
                  sx={{
                    marginBottom: "0 !important",
                    margin: "0",
                    padding: "0.5rem",
                  }}
                  onChange={(e) => {
                    dispatch(updateStartNodeId(e.target.checked ? id : null));
                  }}
                />
              }
              label="Set As a Start Node"
            />
          </Box>
          <Box
            sx={{
              padding: "1rem",
              paddingBottom: "82px",
              height: "60vh",
              overflowY: "auto",
              scrollbarWidth: "none", // Hide scrollbar for Firefox
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {name === "Email" && <ServicesSendEmail />}
            {name === "Email Custom API Call" && <ServicesCustomEmailApi />}
            {name === "HTTP Call" && <HttpServices />}
            {name === "Human Input" && <TextInputServices />}
            {name === "Create Form" && <ServiceDynamic />}
            {name === "External Forms" && <FormApiService />}
            {name === "If Else Clause" && <IfElseServices />}

            {(name === "CSV (Convert JSON to CSV)" ||
              name === "CSV (Convert CSV to JSON)") && <CsvServies />}
            {name === "Concatenation" && <TextService />}
            {name === "Split" && <TextSplitService />}
            {name === "Remove HTML" && <TextRemoveHTMLService />}
            {name === "Replace" && <TextReplaceService />}
            {name === "Find" && <TextFindService />}
            {name === "Output" && <OutputService />}
            {name === "Call Rest API" && <WebHookRecieveHttp />}
            {name === "Table" && <DataTableProperties />}
          </Box>
          <Box className="bottom-action">
            <div>
              <Button variant="outlined" onClick={toggleSidebar}>
                {" "}
                Cancel
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={submitData}>
                Save Changes
              </Button>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

export default RightSidebar;
