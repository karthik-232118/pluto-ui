import { Typography } from "@mui/material";
import nodata from "../../../assets/png/nodata.png";
import PropTypes from "prop-types";

const Nodata = ({ height, width, title, image }) => {
  return (
    <div
      style={{
        textAlign: "center",
        width: "40%",
        maxWidth: width || "30%",
        margin: "0 auto",
      }}
    >
      {/* <Typography variant="body1" style={{ marginBottom: "16px" }}>
        {title}
      </Typography> */}

      {image && (
        <img
          src={nodata}
          alt={title}
          style={{
            height: height || "auto",
            width: "100%", 
            maxWidth: "100%", 
            objectFit: "cover", 
            borderRadius: "8px", 
          }}
        />
      )}
    </div>
  );
};

export default Nodata;

Nodata.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.bool,
};
Nodata.defaultProps = {
  height: "auto",
  width: "30%",
  title: "No data available",
  image: true,
};

