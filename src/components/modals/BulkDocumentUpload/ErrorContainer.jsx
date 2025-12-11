import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
// ErrorContainer Component
const ErrorContainer = ({ errorList, classes }) => (
  <Box className={classes["errorContainer"]}>
    <Typography variant="h6" color="error" gutterBottom>
      {errorList.length} {errorList.length > 1 ? "Errors" : "Error"} Found
    </Typography>
    <ul>
      {errorList.map((error, index) => (
        <li key={index}>
          <Typography variant="body2" color="textSecondary">
            {error}
          </Typography>
        </li>
      ))}
    </ul>
  </Box>
);

export default ErrorContainer;
ErrorContainer.propTypes = {
  errorList: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.object.isRequired,
};

