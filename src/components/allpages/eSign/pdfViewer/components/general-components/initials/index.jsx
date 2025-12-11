import "./index.css";
import PropTypes from "prop-types";

const Initials = ({ formData, setFormData, markerData, receiver }) => {
  const onClickIntialsHandler = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [markerData.markerId]: {
        markerId: markerData.markerId,
        markerType: "text",
        data: receiver.UserName,
      },
    }));
  };

  return (
    <>
      {formData[markerData.markerId]?.data ? (
        <div>{formData[markerData.markerId].data}</div>
      ) : (
        <div className="intials" onClick={onClickIntialsHandler}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            Click to add initials
          </div>
        </div>
      )}
    </>
  );
};

export default Initials;

Initials.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  markerData: PropTypes.shape({
    markerId: PropTypes.string.isRequired,
  }).isRequired,
  receiver: PropTypes.shape({
    UserName: PropTypes.string.isRequired,
  }).isRequired,
};

