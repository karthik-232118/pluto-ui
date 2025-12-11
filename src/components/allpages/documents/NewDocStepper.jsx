import { useState } from "react";
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  styled,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Close } from "@mui/icons-material";
import Newdocuments from "./Newdocuments";
import Configure from "./Configure";
import notify from "../../../assets/svg/utils/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { createDocumentModule } from "../../../services/documentModules/DocumentsModule";
import { GetElementsCategory } from "../../../store/elements/action";

const style = {
  boxShadow: 24,
  padding: "0",
};

const headerStyle = {
  background: (theme) => theme.palette.primary.main,
  padding: "24px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  "& .MuiTypography-h6": {
    color: "#FFFFFF",
  },
  "& .MuiTypography-body2": {
    color: "#FFFFFF",
    opacity: 0.9,
  },
};

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)",
    transition: "background-color 0.2s ease",
  },
}));


const NewDocStepper = ({ open, onClose, editDocumentID = null,ThreeDotClickedData,onTemplateSaveSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();
  const [formData, setFormData] = useState(null);
  const [ownersData, setOwnersData] = useState(null);
  const [endUserData, setEndUserData] = useState(null);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [draftData, setDraftData] = useState(null);
  const handleClose = () => onClose();
  const dispatch = useDispatch();

   const handleTemplateSaveSuccess = (result) => {
    console.log("Template save API result received in NewDocStepper:", result);
    
    if (result.success) {
      console.log("✅ Template saved successfully!");
      console.log("Template ID:", result.templateId);
      console.log("Document Name:", result.documentName);
      console.log("Template Data:", result.templateData);
   // Send the data to ElementFolders via the callback
      if (onTemplateSaveSuccess) {
        onTemplateSaveSuccess({
          success: true,
          templateId: result.templateId,
          documentName: result.documentName,
          templateData: result.templateData,
          message: "Template created successfully"
        });
      }
    } else {
      console.log("❌ Template save failed:", result.error);
      
      // Send failure to ElementFolders
      if (onTemplateSaveSuccess) {
        onTemplateSaveSuccess({
          success: false,
          error: result.error,
          message: "Template creation failed"
        });
      }
    }
  };


  const handleNext = (data, processOwnerList, processOwnerAndEndUserList) => {
    setFormData(data);
    setOwnersData(processOwnerList);
    setEndUserData(processOwnerAndEndUserList);
    if (activeStep < 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleSave();
      onClose();
    }
  };

  const handleSave = async () => {
    const escalationPersonsStakeholders = draftData?.EscalationPersons
      .filter((item) => item?.ApprovalStatus === "Rejected" && item?.IsStakeHolder)
      .map((item) => item?.UserID);

    const eslcChecker = draftData?.EscalationPersons
      .filter((item) => item?.ApprovalStatus === "Rejected" && item?.IsReviewer)
      .map((item) => item?.UserID);
    let payload = {
    }
    if (escalationPersonsStakeholders?.length > 0) {
      payload = {
        ...formData,
        StakeHolder: escalationPersonsStakeholders?.length ? escalationPersonsStakeholders : formData?.StakeHolder,
        StakeHolderEscalationPerson: [],
        EscalationPerson: []
      }
    } else if (eslcChecker?.length > 0) {
      payload = {
        ...formData,
        Checker: eslcChecker?.length ? eslcChecker : formData?.Checker,
        StakeHolderEscalationPerson: [],
        EscalationPerson: [],
        StakeHolder: [],
      }
    }
    else {
      payload = {
        ...formData

      }
    }
    try {
      const response = await createDocumentModule(payload);
      if (response?.status === 201) {
        notify(
          "success",
          t("Document Module created successfully") || response?.data?.message
        );
        dispatch(
          GetElementsCategory({
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          })
        );
      } else {
        notify(
          "error",
          response?.data?.message ||
          response?.data?.error ||
          "An error occurred"
        );
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      onClose();
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Newdocuments
            handleNext={handleNext}
            editDocumentID={editDocumentID}
            handleClose={handleClose}
            ThreeDotClickedData={ThreeDotClickedData}
              onTemplateSaveSuccess={handleTemplateSaveSuccess}
          />
        );
      case 1:
        return (
          <Configure
            ownersData={ownersData}
            endUserData={endUserData}
            data={formData}
            setData={setFormData}
            setDraftData={setDraftData}
          />
        );
      default:
        return <Typography>{t("Unknown Step")}</Typography>;
    }
  };
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 0,
        },
      }}
    >
      <Box sx={style}>
        <Box sx={headerStyle}>
          {activeStep === 0 ? (
            <>
              <Box>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  {t("documentManagement")}
                </Typography>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  {t("addEditDocument")}
                </Typography>
              </Box>
              <CloseButton
                aria-label="close"
                onClick={() => {
                  onClose();
                  localStorage.removeItem("selectedDocumentType");
                }}
              >
                <Close />
              </CloseButton>
            </>
          ) : (
            <>
              <Box>
                <Typography variant="h6" color="inherit">
                  {t("configureUsers")}
                </Typography>
                <Typography variant="body2" color="inherit">
                  {t("This Document will be sent to Displaye Users")}
                </Typography>
              </Box>
              <IconButton aria-label="close" onClick={handleClose}>
                <Close sx={{ color: "#fff" }} />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          pt: 2,
          overflowY: "auto",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Opera
        }}
      >
        {renderStepContent(activeStep)}
      </Box>
      {activeStep === 1 && (
        <DialogActions sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSave();
            }}
          >
            {t("Save")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default NewDocStepper;
