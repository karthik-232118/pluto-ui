import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Check } from "@mui/icons-material";
import PropTypes from "prop-types";

const RiskAndComplianceModalTwo = ({
  open,
  onClose,
  heading,
  RiskAndCompliences,
 
}) => {
  // Ensure the heading matches exactly, fallback to empty array if not found
  const content =
    heading === "Risks"
      ? RiskAndCompliences?.RiskDetailsArrays || []
      : heading === "Compliances"
      ? RiskAndCompliences?.ComplianceDetailsArrays || []
      : heading === "Clauses"
      ? RiskAndCompliences?.ClauseDetailsArrays || []
      : [];
console.log(RiskAndCompliences)
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{ zIndex: 9999 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            outline: "none",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ textAlign: "start", marginBottom: 2 }}
          >
            {heading}
          </Typography>

          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#000",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Divider
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.12)",
              marginBottom: 2,
            }}
          />
          <Typography sx={{ textAlign: "start" }}>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {content.length > 0 ? (
                content.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    {/* Bullet Circle with Check Icon */}
                    <div
                      style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        border: "#0288D114 1.5px solid",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "8px",
                        marginTop: "3px",
                      }}
                    >
                      <Check
                        style={{
                          fontSize: "16px",
                          color: "#3B82F6",
                          height: "10px",
                          width: "10px",
                        }}
                      />
                    </div>

                    {/* The actual bullet text */}
                    <div style={{ color: "#00000099", fontWeight: 350 }}>
                      {item}
                    </div>
                  </li>
                ))
              ) : (
                <li>No {heading} details availables.</li>
              )}
            </ul>
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RiskAndComplianceModalTwo;

RiskAndComplianceModalTwo.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  RiskAndCompliences: PropTypes.shape({
    RiskDetailsArrays: PropTypes.arrayOf(PropTypes.string),
    ComplianceDetailsArrays: PropTypes.arrayOf(PropTypes.string),
    ClauseDetailsArrays: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onItemClick: PropTypes.func, // Callback function for item click
};
