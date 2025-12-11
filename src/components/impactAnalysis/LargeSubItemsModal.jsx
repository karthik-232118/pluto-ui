import PropTypes from "prop-types";

const LargeSubItemsModal = ({
  open,
  onClose,
  subItems,
  handleSubItemClick,
  modalPosition = { x: 0, y: 0 },
}) => {
  // If not open, return null
  if (!open) return null;

  const panelStyle = {
   
    top: modalPosition.y,
    marginTop:"10rem",
    left: modalPosition.x,
    transform: "translate(-50%, -50%)",
    width: 300,
    maxHeight: "60vh",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    overflowY: "auto",
    padding: "16px",
    zIndex: 9999,
  };

  return (
    <div style={panelStyle}>
      <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
        Sub Items ({subItems.length})
      </div>
      {subItems.map((subItem, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "8px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => {
            handleSubItemClick(subItem);
            onClose();
          }}
        >
          {subItem.label}
        </div>
      ))}
      <div
        style={{
          marginTop: "12px",
          textAlign: "right",
          cursor: "pointer",
          color: "#1d4ed8",
        }}
        onClick={onClose}
      >
        Close
      </div>
    </div>
  );
};

export default LargeSubItemsModal;

LargeSubItemsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  handleSubItemClick: PropTypes.func.isRequired,
  modalPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};
LargeSubItemsModal.defaultProps = {
  modalPosition: { x: 0, y: 0 },
};