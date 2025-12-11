import { Box, Typography, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
// import icon from "../../assets/svg/MasterPopup/headingaddicon.svg";
import PropTypes from "prop-types";

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

const CreateCamp = ({ onChange, formState, errors }) => {
  const { t } = useTranslation();
  // Function to generate a unique campaign code with max length of 8
  const generateUniqueCampaignCode = () => {
    const timestamp = Date.now().toString().slice(-6); // Get last 6 digits of timestamp
    const randomNum = Math.floor(Math.random() * 100); // Random number between 0-99
    return `CAMP${timestamp}${randomNum}`.slice(0, 8); // Ensure the final code is 8 characters long
  };

  // When the form is loaded or a new campaign is created
  if (!formState.CampaignCode) {
    // Generate a unique campaign code if none exists in formState
    formState.CampaignCode = generateUniqueCampaignCode();
  }

  return (
    <div>
      <Box>
        <Box display="flex" flexDirection="column" gap="24px">
          <Box>
            <Typography sx={labelStyle}>
            {t("formLabels.campaignName")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="text"
              name="CampaignName"
              placeholder=  {t("formLabels.campaignName")} 
              style={inputStyle}
              value={formState.CampaignName}
              onChange={onChange}
              error={!!errors.CampaignName}
              helperText={errors.CampaignName}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>{t("formLabels.campaignDescription")}</Typography>
            <TextField
              multiline
              rows={4}
              name="CampaignDescription"
              placeholder={t("formLabels.campaignDescription")}
              variant="outlined"
              fullWidth
              onChange={onChange}
              value={formState.CampaignDescription}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
            {t("formLabels.campaignCode")}  <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="text"
              name="CampaignCode"
              placeholder="Enter Campaign Code ..."
              style={inputStyle}
              value={formState.CampaignCode}
              onChange={onChange}
              error={!!errors.CampaignCode}
              helperText={errors.CampaignCode}
              disabled
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CreateCamp;

CreateCamp.propTypes = {
  onChange: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
