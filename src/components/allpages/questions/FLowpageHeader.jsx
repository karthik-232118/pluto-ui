import { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Select,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ExecuteFlow } from "../../../store/flow/action";
import PropTypes from "prop-types";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import Info from "../../../assets/svg/SOPs/Info.svg";
import {
  createSopModule,
  viewSopModuleDraft,
} from "../../../services/sopModules/SopModule";
import { listElementAttributeType } from "../../../services/documentModules/DocumentsModule";
import { setSOPflowModalData } from "../../../store/FlowWithSOP/flowWithSop";
import { frontendState } from "../../../store/presist/action";
import notify from "../../../assets/svg/utils/toast/Toast";
import NewSOPModal from "../../modals/NewSOPModal";
import { useTranslation } from "react-i18next";
const FLowpageHeader = ({ action, hide }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const { SOPReactFlow } = useSelector((state) => state.SOPReactFlow);
  const { isWorkflowEnabled } = useSelector((state) => state.flowWithSop);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const dispatch = useDispatch();
  const IsReactFlow = localStorage.getItem("IsReactFlow");
  const moduleAction = localStorage.getItem("moduleAction"); 
  const [sopName, setSopName] = useState(
    SOPReactFlow?.sopModuleDraft?.Name 
  );
  const [sopDescription, setSopDescription] = useState(
    SOPReactFlow?.sopModuleDraft?.Description || ""
  );
  const [attributeType, setAttributeType] = useState("Standard");
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false); 
  const [isSubmittingChanges, setIsSubmittingChanges] = useState(false);
  const [attributeTypeList, setAttributeTypeList] = useState([]);
  const [isLoadingAttributeTypes, setIsLoadingAttributeTypes] = useState(false);
  const [selectedAttributeTypeObj, setSelectedAttributeTypeObj] =
    useState(null);
  const { t } = useTranslation();
  const SOPCreationType = localStorage.getItem("selectedSOPCard");
  console.log(SOPCreationType, "Hello SOPPP");

  useEffect(() => {
    if (SOPCreationType !== "Import BPMN") {
      setOpenDetailsModal(true);
    }
  }, [SOPCreationType]);
  useEffect(() => {
    if (
      location.pathname.includes("/sops/view") &&
      location.pathname.includes("sop") === "sop-creation"
    ) {
      setSelectedTab(0);
    } else if (location.pathname.includes("sop-creation")) {
      setSelectedTab(1);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (SOPReactFlow?.sopModuleDraft) {
      setSopName(SOPReactFlow.sopModuleDraft.Name || "Untitled SOP");
      setSopDescription(SOPReactFlow.sopModuleDraft.Description || "");
      setAttributeType(SOPReactFlow.sopModuleDraft.AttributeType || "Standard");
    }
  }, [SOPReactFlow]);
  useEffect(() => {
    const fetchAttributeTypes = async () => {
      setIsLoadingAttributeTypes(true);
      try {
        const response = await listElementAttributeType({
          ModuleTypeID: presistStore?.ModuleTypeID,
          ContentID: presistStore?.ContentID,
          IsPagination: false,
          Search: "",
        });

        if (response?.status === 200) {
          const attributeTypes = (response.data.data.elementAttributes || [])
            .slice()
            .reverse();
          setAttributeTypeList(attributeTypes);
          if (attributeType) {
            const matchingType = attributeTypes.find(
              (type) => type.Name === attributeType
            );
            setSelectedAttributeTypeObj(matchingType || null);
          }
        }
      } catch (error) {
        notify("error", "Failed to fetch attribute types");
      } finally {
        setIsLoadingAttributeTypes(false);
      }
    };
    if (presistStore?.ModuleTypeID && presistStore?.ContentID) {
      fetchAttributeTypes();
    }
  }, [presistStore, attributeType]);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      dispatch(
        ExecuteFlow({
          FlowID: SOPReactFlow.sopModuleDraft?.SOPID,
          CreatedBy: localStorage.getItem("user_id"),
        })
      );
      navigate(`/sops/view`);
    } else if (newValue === 1) {
      navigate(`/sop-creation`);
    }
  };
  const handleNameEdit = () => {
    setEditingName(true);
  };
  const handleNameSave = async () => {
    setEditingName(false);
    if (SOPReactFlow?.sopModuleDraft?.Name !== sopName) {
      updateSopDetails();
    }
  };
  const handleDescriptionEdit = () => {
    setEditingDescription(true);
  };
  const handleDescriptionSave = async () => {
    setEditingDescription(false);
    if (SOPReactFlow?.sopModuleDraft?.Description !== sopDescription) {
      updateSopDetails();
    }
  };
  const updateSopDetails = async () => {
    if (!SOPReactFlow?.sopModuleDraft?.SOPID) return;
    setIsSubmittingChanges(true);
    try {
      const data = {
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
        SOPID: SOPReactFlow.sopModuleDraft.SOPID,
        SOPName: sopName,
        SOPDescription: sopDescription,
        ElementAttributeTypeID:
          SOPReactFlow.sopModuleDraft.ElementAttributeTypeID,
      };
      dispatch(
        setSOPflowModalData({
          ...SOPReactFlow.sopModuleDraft,
          SOPName: sopName,
          SOPDescription: sopDescription,
        })
      );

      dispatch(
        frontendState({
          ...data,
          SOPOwner: SOPReactFlow.sopModuleDraft.SOPOwner,
          SOPIsActive: SOPReactFlow.sopModuleDraft.SOPIsActive,
        })
      );
      const response = await createSopModule(data);
      if (response?.status === 201) {
        notify("success", "SOP details updated successfully");
      }
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Failed to update SOP details"
      );
    } finally {
      setIsSubmittingChanges(false);
    }
  };

  const handleAttributeTypeChange = async (event) => {
    const newAttributeType = event.target.value;
    setAttributeType(newAttributeType);
    const matchingType = attributeTypeList.find(
      (type) => type.Name === newAttributeType
    );
    setSelectedAttributeTypeObj(matchingType || null);
    if (openDetailsModal) {
      handleModalDataUpdate(undefined, undefined, matchingType);
    }

    if (SOPReactFlow?.sopModuleDraft?.SOPID) {
      try {
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ContentID: presistStore?.ContentID,
          SOPID: SOPReactFlow.sopModuleDraft.SOPID,
          AttributeType: newAttributeType,
          ElementAttributeTypeID: matchingType?.ElementAttributeTypeID,
        };
        dispatch(
          setSOPflowModalData({
            ...SOPReactFlow.sopModuleDraft,
            AttributeType: newAttributeType,
            ElementAttributeTypeID: matchingType?.ElementAttributeTypeID,
          })
        );
        await createSopModule(data);
      } catch (error) {
        notify("error", "Failed to update attribute type");
        setAttributeType(
          SOPReactFlow.sopModuleDraft.AttributeType || "Standard"
        );
        setSelectedAttributeTypeObj(null);
      }
    }
  };

  const handleOpenDetailsModal = () => {
    if (
      attributeType &&
      attributeTypeList.length > 0 &&
      !selectedAttributeTypeObj
    ) {
      const matchingType = attributeTypeList.find(
        (type) => type.Name === attributeType
      );
      if (matchingType) {
        setSelectedAttributeTypeObj(matchingType);
      }
    }
    setOpenDetailsModal(true);
  };

  const handleDetailsModalClose = () => {
    setOpenDetailsModal(false);
  };

  const handleModalDataUpdate = (name, description, attributeTypeObj) => {
    if (name) setSopName(name);
    if (description) setSopDescription(description);
    if (attributeTypeObj) {
      setAttributeType(attributeTypeObj.Name);
      setSelectedAttributeTypeObj(attributeTypeObj);
    }
  };

  const getSopDetails = async (sopId) => {
    if (!sopId) return;

    try {
      const data = {
        SOPID: sopId,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };

      const response = await viewSopModuleDraft(data);
      if (response?.status === 200) {
        const sopDraft = response?.data?.data?.sopModuleDraft;
        setSopName(sopDraft?.SOPName || "Untitled SOP");
        setSopDescription(sopDraft?.SOPDescription || "");
        setAttributeType(sopDraft?.AttributeType || "Standard");
        dispatch(setSOPflowModalData(sopDraft));
      }
    } catch (error) {
      notify("error", "Failed to fetch SOP details");
    }
  };

  useEffect(() => {
    if (SOPReactFlow?.sopModuleDraft?.SOPID) {
      getSopDetails(SOPReactFlow.sopModuleDraft.SOPID);
    }
  }, [SOPReactFlow?.sopModuleDraft?.SOPID]);

  const handleAttributeTypeFromModal = (type, obj) => {
    if (type) {
      setAttributeType(type);
      setSelectedAttributeTypeObj(obj);
      if (SOPReactFlow?.sopModuleDraft?.SOPID && obj) {
        updateAttributeTypeInBackend(type, obj.ElementAttributeTypeID);
      }
    }
  };
  const updateAttributeTypeInBackend = async (newType, typeId) => {
    try {
      const data = {
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
        SOPID: SOPReactFlow.sopModuleDraft.SOPID,
        AttributeType: newType,
        ElementAttributeTypeID: typeId,
      };
      dispatch(
        setSOPflowModalData({
          ...SOPReactFlow.sopModuleDraft,
          AttributeType: newType,
          ElementAttributeTypeID: typeId,
        })
      );
      await createSopModule(data);
      notify("success", "Attribute type updated successfully");
    } catch (error) {
      notify("error", "Failed to update attribute type");
    }
  };

  return (
    <Box className="flow-header">
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 3,
          padding: "25px",
        }}
      >
        {moduleAction !== "Edit" && (
          <>
            <Box sx={{ minWidth: "180px" }}>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  mb: 0.5,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "#5f6368",
                }}
              >
                {t("attribute type")}
              </Typography>
              {isLoadingAttributeTypes ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", height: "40px" }}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Select
                  value={attributeType}
                  onChange={handleAttributeTypeChange}
                  size="small"
                  fullWidth
                  sx={{
                    fontSize: "0.875rem",
                    height: "40px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    "& .MuiSelect-select": {
                      padding: "10px 14px",
                      fontWeight: 500,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dadce0",
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  }}
                >
                  {attributeTypeList.map((type) => (
                    <MenuItem
                      key={type.ElementAttributeTypeID}
                      value={type.Name}
                      sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      {type.Name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
            <Box sx={{ minWidth: "280px" }}>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  mb: 0.5,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "#5f6368",
                }}
              >
               {t("sop_name")}
              </Typography>
              {editingName ? (
                <TextField
                  size="small"
                  value={sopName}
                  onChange={(e) => setSopName(e.target.value)}
                  onBlur={handleNameSave}
                  autoFocus
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleNameSave}
                          edge="end"
                          size="small"
                          disabled={isSubmittingChanges}
                          sx={{
                            color: "#1976d2",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.08)",
                            },
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor: "#ffffff",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      "& fieldset": {
                        borderColor: "#dadce0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                  fullWidth
                />
              ) : (
                <Box
                  onClick={handleNameEdit}
                  sx={{
                    cursor: "pointer",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #dadce0",
                    backgroundColor: "#ffffff",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #1976d2",
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                    },
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: "#202124",
                      flex: 1,
                    }}
                  >
                    {sopName}
                  </Typography>
                  <EditIcon
                    sx={{
                      ml: 1,
                      fontSize: "18px",
                      color: "#5f6368",
                      transition: "color 0.2s ease-in-out",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: "320px" }}>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  mb: 0.5,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "#5f6368",
                }}
              >
                {t("sop_description")}
              </Typography>
              {editingDescription ? (
                <TextField
                  size="small"
                  value={sopDescription}
                  onChange={(e) => setSopDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  placeholder={t("enter_sop_description")}
                  autoFocus
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleDescriptionSave}
                          edge="end"
                          size="small"
                          disabled={isSubmittingChanges}
                          sx={{
                            color: "#1976d2",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.08)",
                            },
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor: "#ffffff",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      "& fieldset": {
                        borderColor: "#dadce0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                  fullWidth
                />
              ) : (
                <Box
                  onClick={handleDescriptionEdit}
                  sx={{
                    cursor: "pointer",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #dadce0",
                    backgroundColor: "#ffffff",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #1976d2",
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
                    },
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: sopDescription ? "#202124" : "#9aa0a6",
                      flex: 1,
                      fontSize: "0.875rem",
                      fontWeight: sopDescription ? 500 : 400,
                      fontStyle: sopDescription ? "normal" : "italic",
                    }}
                  >
                    {sopDescription }
                  </Typography>
                  <EditIcon
                    sx={{
                      fontSize: "18px",
                      color: "#5f6368",
                      transition: "color 0.2s ease-in-out",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box
              sx={{
                marginTop: "0.7rem",
                marginLeft: "-1rem",
                display: "flex",
                alignItems: "start",
              }}
            >
              <IconButton
                onClick={handleOpenDetailsModal}
                sx={{
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                <img src={Info} alt="" width={40} height={40} />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
      <div>
        {IsReactFlow === "true" && !hide && (
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="workflow tabs"
            sx={{ height: "40px" }}
          >
            <Tab label="Editor" value={1} variant="caption" />
            <Tab
              label="Execution"
              value={0}
              disabled={!isWorkflowEnabled}
              variant="caption"
            />
          </Tabs>
        )}
      </div>
      {action || <div />}
      {moduleAction !== "Edit" && (
        <NewSOPModal
          open={openDetailsModal}
          onClose={handleDetailsModalClose}
          attributeType={attributeType}
          onDataUpdate={handleModalDataUpdate}
          sopName={sopName}
          sopDescription={sopDescription}
          selectedAttributeTypeObj={selectedAttributeTypeObj}
          attributeTypeList={attributeTypeList}
          initialValues={{
            sopName,
            sopDescription,
            attributeType,
            selectedAttributeTypeObj,
          }}
          onAttributeTypeSelected={handleAttributeTypeFromModal}
          onSopNameUpdated={(name) => setSopName(name)}
          onSopDescriptionUpdated={(desc) => setSopDescription(desc)}
        />
      )}
    </Box>
  );
};

export default FLowpageHeader;

FLowpageHeader.propTypes = {
  action: PropTypes.node,
  hide: PropTypes.bool,
};
FLowpageHeader.defaultProps = {
  action: null,
  hide: false,
};