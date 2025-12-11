import {
  Box,
  Divider,
  Typography,
  Chip,
  IconButton,
  Modal,
  FormControlLabel,
  Switch,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import eye from "../../../assets/svg/MyAchivments/eyeIcon.svg";
import CertificateWithAPIContent from "./CertificateWithAPIContent";
import CertificateWithAPIContent2 from "./CertificateWithAPIContent2";
import { useDispatch, useSelector } from "react-redux";
import { GetCertificate } from "../../../store/certificate/action";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";

const MyAchievements = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isMCQ, setIsMCQ] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  console.log(selectedAchievement,"grrrennn");

  const dispatch = useDispatch();

  useEffect(() => {
    const moduleType = isMCQ ? "mcqs" : "test";
    dispatch(GetCertificate({ ModuleType: moduleType }));
  }, [dispatch, isMCQ]);

  const { data, loading, error } = useSelector((state) => state.certificate);

  const handleSwitchChange = () => {
    setIsMCQ((prev) => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "550",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            {t("myAchievementsTitle")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748B",
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: "400",
            }}
          >
            {t("myAchievementsDescription")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{ color: !isMCQ ? "blue" : "text.primary", marginRight: "8px" }}
          >
            {t("tesLabel")}
          </Typography>
          <FormControlLabel
            control={<Switch checked={isMCQ} onChange={handleSwitchChange} />}
            label={
              <Typography
                variant="body2"
                sx={{ color: isMCQ ? "blue" : "text.primary" }}
              >
                {t("mcqLabel")}
              </Typography>
            }
            labelPlacement="end"
          />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      {loading && <Typography variant="body1">Loading...</Typography>}
      {error && (
        <Typography variant="body1" color="error">
          {t("errorLoadingAchievements")}
        </Typography>
      )}

      {data?.achivements?.length > 0 ? (
        data.achivements.map((achievement, index) => (
          <React.Fragment key={achievement.TestMCQID}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "500",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {achievement.TestMCQName} {achievement.TestSimulationName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Version: {achievement.MasterVersion || "N/A"}
                </Typography>
                <Chip
                  label="Completed"
                  sx={{
                    backgroundColor: "#16A34A",
                    color: "#fff",
                    height: 20,
                    fontSize: { xs: "0.625rem", md: "0.75rem" },
                    mt: 1,
                  }}
                />
              </Box>

              {/* Eye Icon Button */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => {
                    setSelectedAchievement(achievement);
                    setSelectedCertificate("certificate1");
                    setOpenModal(true); // Open modal directly
                  }}
                >
                  <img src={eye} alt="View" />
                </IconButton>
              </Box>
            </Box>
            {index !== data.achivements.length - 1 && <Divider />}
          </React.Fragment>
        ))
      ) : (
        <Typography variant="body1">{t("noAchievements")}</Typography>
      )}

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* X Icon at top-right */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          {selectedCertificate === "certificate1" && (
            <CertificateWithAPIContent data={selectedAchievement} />
          )}
          {selectedCertificate === "certificate2" && (
            <CertificateWithAPIContent2 />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MyAchievements;
