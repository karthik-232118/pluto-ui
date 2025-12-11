import  { useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import styles from "./ReadMoreLess.module.css";
import PropTypes from "prop-types";

const ReadMoreLess = ({ text, label, clip = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="body2" className={styles.text}>
        {label && <span className={styles.label}>{label} :</span>}
        {isExpanded
          ? text
          : `${text.slice(0, clip)}${text?.length > clip ? "..." : ""}`}
        {text?.length > clip && (
          <Button
            variant="text"
            onClick={handleToggle}
            className={styles.button}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </Typography>
    </Box>
  );
};

export default ReadMoreLess;

ReadMoreLess.propTypes = {
  text: PropTypes.string.isRequired, // The text to display
  label: PropTypes.string, // Optional label for the text
  clip: PropTypes.number, // Number of characters to clip before showing "Read More"
};
ReadMoreLess.defaultProps = {
  label: "",
  clip: 100, // Default clip length
};
