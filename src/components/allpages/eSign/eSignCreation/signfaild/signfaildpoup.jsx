import { Button, Modal, Typography, Box } from "@mui/material";
import "../reviewandSend/index.css";
import dummyimagesquare from "./dummy-image-square.webp";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function Signfaildpoup({ show, setShow, validateMessage }) {
  const { t } = useTranslation();
  return (
    <Modal
      open={show}
      onClose={() => setShow(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          display: "flex",
          width: "80%",
          maxWidth: "900px",
          margin: "auto",
          mt: "10%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 1,
        }}
      >
        <Box component="img" src={dummyimagesquare} sx={{ width: "50%" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 2,
            width: "50%",
          }}
        >
          <Typography variant="h5" component="p" className="esign-page-heading">
           {t("Signature field missing")}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className="esign-page-subheading"
          >
          {t("Don't forget to show your recipients where to sign.")}
            {validateMessage}
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShow(false)}
              sx={{ borderRadius: "999px" }}
            >
              { t("Return to document") } 
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default Signfaildpoup;

Signfaildpoup.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  validateMessage: PropTypes.string.isRequired,
};
