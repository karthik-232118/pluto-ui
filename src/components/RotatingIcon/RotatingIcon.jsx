import { styled } from "@mui/styles";
import PropTypes from "prop-types";

// Define the rotating animation directly for the icon
const RotatingIconWrapper = styled("span")(() => ({
  display: "inline-flex", // Ensures proper centering
  alignItems: "center",
  justifyContent: "center",
  animation: "rotate 1s linear infinite",
  transformOrigin: "center", // Ensures rotation occurs around the center
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const RotatingIcon = ({ children }) => {
  return <RotatingIconWrapper>{children}</RotatingIconWrapper>;
};

export default RotatingIcon;

RotatingIcon.propTypes = {
  children: PropTypes.node.isRequired, // The icon or content to be rotated
};
RotatingIcon.defaultProps = {
  children: null, // Default to no children if not provided
};

