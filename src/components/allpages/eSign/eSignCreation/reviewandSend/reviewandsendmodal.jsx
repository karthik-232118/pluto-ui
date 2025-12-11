import { useState } from "react";
import { Modal, Button, TextField, Typography, Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import "./index.css";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

function Reviewandsendmodal({
  show,
  setShow,
  data,
  setReviewData,
  reviewData,
  handleSubmit,
  isSending,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [readMoreOrLess, setReadMoreOrLess] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="review-and-send-title"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 6,
          width: "90%",
          maxWidth: "1300px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 1,
          p: 3,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" mb={2}>
            {t("Review And Send")}
          </Typography>

          <Typography variant="h6" mb={1} className="esign-page-heading">
            {t("Compose your email invite")}
          </Typography>

          <TextField
            fullWidth
            label={t("Reference Number")}
            value={reviewData?.referenceNo}
            required
            onChange={(e) =>
              setReviewData({
                ...reviewData,
                referenceNo: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t("Subject")}
            value={reviewData?.subject}
            required
            onChange={(e) =>
              setReviewData({
                ...reviewData,
                subject: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t("Message")}
            multiline
            rows={6}
            required
            value={reviewData?.message}
            onChange={(e) =>
              setReviewData({
                ...reviewData,
                message: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <Button
            variant="text"
            onClick={() => setReadMoreOrLess(!readMoreOrLess)}
          >
            {readMoreOrLess ? t("Less Option") : t("More Option")}
          </Button>

          {!readMoreOrLess && (
            <Box sx={{ mt: 2, pt: 2 }}>
              <Typography
                variant="h6"
                className="esign-page-heading"
                gutterBottom
              >
                {t("Add CC")}
              </Typography>
              <Typography variant="body2" className="esign-page-subheading">
                {t(
                  "These recipients will receive a copy of the completed agreement"
                )}
              </Typography>
              <TextField
                fullWidth
                placeholder={t("Enter email addresses")}
                value={reviewData?.cc}
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    cc: e.target.value,
                  })
                }
                sx={{ mt: 1 }}
              />
              <Typography
                variant="caption"
                className="esign-page-subheading"
                color="textSecondary"
              >
                {t(
                  "Separate email addresses with a comma, semicolon, or space"
                )}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            maxHeight: readMoreOrLess ? "400px" : "600px", // Set the maximum height for the box
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          <Typography variant="h6" color="error" className="esign-page-heading">
            {t("Confirm all recipients and submit agreement")}
          </Typography>
          <Typography variant="h6" className="esign-page-heading">
            {t("Recipients")}
          </Typography>
          <Typography variant="body2" className="esign-page-subheading" mb={2}>
            {t(
              "An email will be sent to recipients to sign the agreement. All parties will receive a signed copy upon completion."
            )}
          </Typography>
          {data?.receivers?.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                py: 1,
                borderBottom: "1px solid #ddd",
              }}
            >
              <Box
                sx={{
                  padding: "30px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" className="doc-name">
                    {item?.UserEmail}
                  </Typography>
                  <Typography variant="caption" className="candiate-name">
                    {item?.UserName}
                  </Typography>
                </Box>
                <LockOpenIcon />
              </Box>
            </Box>
          ))}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isSending}
              sx={{ textTransform: "none", color: "#000", borderColor: "#000" }}
            >
              {t("Cancel")}
            </Button>
            <Button variant="contained" type="submit" disabled={isSending}>
              {t("Submit")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default Reviewandsendmodal;

Reviewandsendmodal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setReviewData: PropTypes.func.isRequired,
  reviewData: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
};
