import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const ColorfulDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
}));

const GradientDialogTitle = styled(DialogTitle)(() => ({
  background: "linear-gradient(45deg, #2196F3,rgb(54, 86, 184))",
  color: "white",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
}));

const CloseButton = styled(IconButton)(() => ({
  color: "white",
  position: "absolute",
  right: 12,
  top: 12,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
}));

const VersionComparisonModal = ({ open, onClose, newTitles }) => {
  const theme = useTheme();

  return (
    <ColorfulDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <GradientDialogTitle>
        <Typography variant="p" sx={{ fontWeight: 400, fontSize: "0.8em" }}>
          New Nodes Added ({newTitles?.length})
        </Typography>
        <CloseButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </GradientDialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        {newTitles?.length > 0 ? (
          <Box>
            <Box
              component="ul"
              sx={{
                paddingLeft: "30px", // Adjust padding for a different look
                listStyleType: "none", // Remove default list bullets
                margin: 0,
                "& li": {
                  marginBottom: "12px", // Increase the gap between items
                  color: theme.palette.text.primary, // Change the text color
                  position: "relative",
                  display: "flex", // Flexbox for better alignment
                  alignItems: "center", // Center text vertically
                  "&:before": {
                    content: '"★"', // Change bullet style to a star symbol
                    color: theme.palette.warning.main, // Change bullet color to yellow
                    fontWeight: "bold",
                    fontSize: "1.2em", // Make bullet larger
                    marginRight: "10px", // Space between bullet and text
                  },
                },
              }}
            >
              {newTitles?.map((title, index) => (
                <li key={index}>
                  <Typography variant="body1" sx={{ marginTop: "10px" }}>
                    {title}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontStyle: "italic",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            No changes found between versions.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #2196F3, #2196f3)",
            borderRadius: "8px",
            padding: "8px 24px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              background: "linear-gradient(45deg, #303f9f, #1976d2)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </ColorfulDialog>
  );
};

export default VersionComparisonModal;

VersionComparisonModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
