import { LinearProgress, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProgressBar = ({ progress }) => {
  return (
    <Box sx={{ mt: 3, width: "100%" }}>
      <Typography variant="body2" align="center">
        Uploading: {progress}%
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
    </Box>
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired, // Progress should be a number between 0 and 100
};
ProgressBar.defaultProps = {
  progress: 0, // Default progress value
};
ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired, // Progress should be a number between 0 and 100
};
