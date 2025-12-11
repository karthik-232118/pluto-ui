import { Typography } from "@mui/material";
import nodata from "../../../assets/png/allcaughtup.png";
import PropTypes from "prop-types";

const Allcaughtup = ({ height, width, title, image }) => {
  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        maxWidth: width || "340px",
        margin: "0 auto",
      }}
    >
      <Typography variant="body1" style={{ marginBottom: "16px" }}>
        {title}
      </Typography>

      {image && (
        <img
          src={nodata}
          alt="No data available"
          style={{
            height: height || "auto",
            width: "80%", // Adjusted to fit better in the container
            maxWidth: "100%", // Ensure it doesn't overflow
            objectFit: "cover", // Use 'contain' to maintain aspect ratio
            borderRadius: "8px", // Optional: add some rounding for aesthetics
          }}
        />
      )}
    </div>
  );
};

export default Allcaughtup;

Allcaughtup.propTypes = { 
  height: PropTypes.string,
  width: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.bool,
};