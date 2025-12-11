import { Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

// Utility function to remove HTML tags
const stripHtmlTags = (text) => {
  if (!text) return "";
  return text.replace(/<\/?[^>]+(>|$)/g, ""); // Regex to remove HTML tags
};

const FormDetailModal = ({ open, onClose, questions, answers }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "8px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            position: "relative",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.700",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
            }}
          >
            (Form) Questions & Answers
          </Typography>
        </Box>

        {/* Scrollable Questions Section */}
        <Box
          sx={{
            overflowY: "auto",
            p: 2,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {questions && questions.length > 0 ? (
            questions
              .filter((q) => {
                const answer = answers.find((ans) => ans.id === q.id);
                return answer && answer.value !== null && answer.value !== undefined;
              })
              .map((q, index) => {
                const answer = answers.find((ans) => ans.id === q.id);
                const answerValue = answer ? answer.value : null;

                return (
                  <Box
                    key={q.id}
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: "grey.100",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      Q{index + 1}: {stripHtmlTags(q.label)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 1,
                        ml: 2,
                      }}
                    >
                      Answer:{" "}
                      {typeof answerValue === "object"
                        ? JSON.stringify(answerValue)
                        : answerValue}
                    </Typography>
                  </Box>
                );
              })
          ) : (
            <Typography variant="body1">
              No questions available for this submission.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default FormDetailModal;

FormDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.any, // Can be string, number, or object
    })
  ).isRequired,
};
