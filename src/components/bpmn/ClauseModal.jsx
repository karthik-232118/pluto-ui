import  { useEffect } from "react";
import { Modal, Box, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetListRiskAndCompliences } from "../../store/riskandCompliences/action";
import PropTypes from "prop-types";

export const ClauseModal = ({ open, onClose, contentID }) => {
  const dispatch = useDispatch();

  const { RiskAndCompliences } = useSelector(
    (state) => state.RiskAndCompliences
  );

  useEffect(() => {
    if (contentID) {
      dispatch(GetListRiskAndCompliences({ RiskAndComplianceID: contentID }))
        .unwrap()
        .catch((error) => {
          console.error("Failed to fetch Risk and Compliance data:", error);
        });
    }
  }, [contentID, dispatch]);

  // Extract ClauseDetailsArrays if available
  const clauseDetails = RiskAndCompliences?.ClauseDetailsArrays || [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="clause-modal-header" style={{marginBottom:"1rem"}}>
          <h2>Clause</h2>
        </div>
        <Divider />
        <div className="clause-modal-content">
          {clauseDetails.length > 0 ? (
            <ul>
              {clauseDetails.map((clause, index) => (
                <li key={index}>{clause}</li>
              ))}
            </ul>
          ) : (
            <p>No clauses available.</p>
          )}
        </div>
        <div className="clause-modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </Box>
    </Modal>
  );
};

ClauseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  contentID: PropTypes.string.isRequired,
};
