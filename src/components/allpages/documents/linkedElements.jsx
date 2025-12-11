import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close, RemoveRedEye } from "@mui/icons-material";
import { linkedElements } from "../../../services/documentModules/DocumentsModule";
import { useTheme } from "@mui/styles";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
};

const LinkedElements = ({ ElementAttributeTypeID }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const Fecthdata = async (payload) => {
    try {
      const res = await linkedElements(payload);
      if (res.status === 200) {
        setData(res.data?.data || []);
        // Process the data as needed
      } else {
        console.error("Error fetching data:", res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (ElementAttributeTypeID && open) {
      Fecthdata({ ElementAttributeTypeID });
    }
  }, [ElementAttributeTypeID, open]);

  const headerStyle = {
    background: bgColor,
    padding: "24px",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative", // Add this
    "& .MuiTypography-h6": {
      color: "#FFFFFF",
    },
    "& .MuiTypography-body2": {
      color: "#FFFFFF",
      opacity: 0.9,
    },
  };

  return (
    <div>
      <Tooltip title={t("view Linked Elements")}>
        <IconButton variant="contained" onClick={handleOpen}>
          <RemoveRedEye />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={headerStyle}>
            <Typography id="modal-title" variant="h6" component="h2">
              {t("Linked Elements")}
            </Typography>
            <IconButton
              style={{ position: "absolute", right: 0, top: 0 }}
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Box>

          {data?.linkedElements?.length > 0 ? (
            <Box
              mt={2}
              p={2}
              sx={{
                maxHeight: 400,
                overflowX: "hidden",
                overflowY: "scroll",
                marginBottom: "40px",
              }}
            >
              {data?.linkedElements?.map((element, index) => (
                <Box
                  key={index?.ElementID}
                  mb={2}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius={1}
                >
                  <Typography variant="body1">
                    {element.ElementName || t("No Name Available")}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              display={"flex"}
              justifyContent={"center"}
              m={2}
            >
              {t("No linked elements found.")}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default LinkedElements;
