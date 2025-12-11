import { Box, Tabs, Tab, Typography } from "@mui/material";
import Properties from "./Properties";
import Attachment from "./Attachment";
import RoleContent from "./RoleContent";
import WorkFLowServices from "./WorkFLowServices";
import roleicon from "../../../assets/svg/flowpage/roles.svg";
import clip from "../../../assets/svg/flowpage/clip.svg";
import properties from "../../../assets/svg/flowpage/properties.svg";
import { useSelector } from "react-redux";
import UsbIcon from "@mui/icons-material/Usb";
import UsbOffIcon from "@mui/icons-material/UsbOff";
import { geticons } from "../../../utils";
import PropTypes from "prop-types";

const propertiesIcon = (tabvalue) => {
  if (tabvalue === 0) {
    return properties;
  }
  if (tabvalue === 1) {
    return clip;
  }
  if (tabvalue === 2) {
    return roleicon;
  }
  return;
};
const showName = (tabvalue) => {
  if (tabvalue === 0) {
    return "Properties";
  }
  if (tabvalue === 1) {
    return "Attachment";
  }
  if (tabvalue === 2) {
    return "Roles";
  }
};
const SopProperties = ({
  selectedTab,
  handleTabChange,
  handleFileChange,
  handleDeleteClip,
  handleDeleteImage,
  handleSave,
  selectedNode,
  newLabel,
  setNewLabel,
  newSubLabel,
  setNewSubLabel,
  newColor,
  setNewColor,
  selectedImage,
  debuggingInfo,
  handleCloseDrawer,
  isWorkflowEnabled,
  selectedClipNode,
  openService,
  CustomSubmit,
}) => {
  const { name, id } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  return (
    <Box>
      {selectedTab === 3 &&
        [
          "Email",
          "Email Custom API Call",
          "HTTP Call",
          "Human Input",
          "Create Form",
          "External Forms",
          "If Else Clause",
          "CSV (Convert JSON to CSV)",
          "CSV (Convert CSV to JSON)",
          "Concatenation",
          "Split",
          "Remove HTML",
          "Replace",
          "Find",
          "Output",
          "Call Rest API",
        ].includes(name) && (
          <Box
            className="RightSide_Bar_Header_Section"
            sx={{
              width: "100%",
            }}
          >
            <Box display={"flex"} gap={2} paddingLeft={2} alignItems={"center"}>
              <img
                src={geticons(name)}
                alt={name}
                className="rightSide_Bar_icon"
              />
              <Typography variant="h6" className="RightSideBar_Heading">
                {name}
              </Typography>
            </Box>
            {!nodeData[id] ? (
              <UsbIcon color="success" fontSize="small" marginRight={"auto"} />
            ) : (
              <UsbOffIcon fontSize="small" marginRight={"auto"} />
            )}
          </Box>
        )}
      {selectedTab !== 3 && (
        <Box
          className="RightSide_Bar_Header_Section"
          sx={{
            width: "100%",
          }}
        >
          <Box display={"flex"} gap={2}>
            <Box
              component="img"
              src={propertiesIcon(selectedTab)}
              alt="Roles Icon"
              sx={{ marginRight: "10px" }}
            />
            <Typography
              style={{ fontWeight: "450", fontSize: "15px" }}
              marginBottom={0}
            >
              {showName(selectedTab)}
            </Typography>
          </Box>
          <div />
        </Box>
      )}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        orientation="vertical"
        style={{
          overflowY: "auto",
          display: "flex",
          backgroundColor: "#fff",
          flexDirection: "column",
          justifyContent: "space-between", // Align tabs to the top and bottom
          alignItems: "flex-end", // Align tabs to the right side
          marginLeft: "auto", // Push tabs to the right side of the container
          width: "50px", // Adjust width for better alignment
          position: "absolute",
          right: "0",
          padding: "0px",
          zIndex: 10,
          height: "calc(100% - 80px)", // Make sure the Tabs container fills the parent's height
        }}
      >
        <Tab
          label="Properties"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(360deg)",
            textAlign: "center",
            padding: "52px 60px",
            backgroundColor: "#2196F31F",
            color: "#2196F3",
          }}
        />
        <Tab
          label="Attachment"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(360deg)",
            textAlign: "center",
            padding: "52px 60px",
            backgroundColor: "#EF6C0014",
            color: "#EF6C00",
          }}
        />
        <Tab
          label="Role"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(360deg)",
            textAlign: "center",
            padding: "52px 60px",
            backgroundColor: "#9C27B014",
            color: "#9C27B0",

            // height: "100%", // Ensure it takes up full height
          }}
        />

        {isWorkflowEnabled && (
          <Tab
            label="Workflow"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(360deg)",
              textAlign: "center",
              padding: "52px 60px",
              backgroundColor: "#d6f5c9",
              color: "#379110",

              // height: "100%", // Ensure it takes up full height
            }}
          />
        )}
      </Tabs>
      {openService && (
        <Box
          sx={{
            width: "340px",
            height: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#ffffff",
              position: "relative",
              paddingBottom: "50px",
              height: "100%",
              maxHeight: "64vh",
              overflowY: "auto",
            }}
          >
            {selectedTab === 2 && (
              <RoleContent
                debuggingInfo={debuggingInfo}
                handleCloseDrawer={handleCloseDrawer}
              />
            )}
            {selectedTab === 0 && (
              <Properties
                newLabel={newLabel}
                setNewLabel={setNewLabel}
                newSubLabel={newSubLabel}
                setNewSubLabel={setNewSubLabel}
                newColor={newColor}
                setNewColor={setNewColor}
                selectedImage={selectedImage}
                handleFileChange={handleFileChange}
                handleDeleteClip={handleDeleteClip}
                handleDeleteImage={handleDeleteImage}
                handleSave={handleSave}
                selectedNode={selectedNode}
              />
            )}
            {selectedTab === 1 && (
              <Attachment
                handleCloseDrawer={handleCloseDrawer}
                selectedClipNode={selectedClipNode}
              />
            )}
            {selectedTab === 3 && (
              <WorkFLowServices isWorkflowEnabled={isWorkflowEnabled} />
            )}
          </Box>
          {CustomSubmit}
        </Box>
      )}
    </Box>
  );
};

export default SopProperties;

SopProperties.propTypes = {
  selectedTab: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleDeleteClip: PropTypes.func.isRequired,
  handleDeleteImage: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectedNode: PropTypes.object.isRequired,
  newLabel: PropTypes.string.isRequired,
  setNewLabel: PropTypes.func.isRequired,
  newSubLabel: PropTypes.string.isRequired,
  setNewSubLabel: PropTypes.func.isRequired,
  newColor: PropTypes.string.isRequired,
  setNewColor: PropTypes.func.isRequired,
  selectedImage: PropTypes.string.isRequired,
  debuggingInfo: PropTypes.object.isRequired,
  handleCloseDrawer: PropTypes.func.isRequired,
  isWorkflowEnabled: PropTypes.bool.isRequired,
  selectedClipNode: PropTypes.object.isRequired,
  openService: PropTypes.bool.isRequired,
  CustomSubmit: PropTypes.element,
};
