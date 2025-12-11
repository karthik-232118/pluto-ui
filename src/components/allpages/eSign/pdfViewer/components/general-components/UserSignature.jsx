import PropTypes from "prop-types";
const UserSignature = ({ markerData }) => {
  const { signature, name } = markerData; // Extract signature image and user name

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <img
        src={signature}
        alt={`${name}'s Signature`}
        style={{ width: "150px", height: "50px", objectFit: "contain" }}
      />

      <div style={{ fontWeight: "bold", marginBottom: "5px",marginTop:"0.5rem" }}>{name}</div>
    </div>
  );
};

export default UserSignature;

UserSignature.propTypes = {
  markerData: PropTypes.shape({
    signature: PropTypes.string.isRequired, // Base64 string of the signature image
    name: PropTypes.string.isRequired, // Name of the user
  }).isRequired,
};
