


import  { useEffect, useState } from "react";
import { Modal, Box, Typography, IconButton, List, ListItem, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ModalComponent = ({ open, handleClose, heading,currentNodeId }) => {
  const selectedLinks = useSelector((state) => state?.attachments?.selectedLinks);
  const [displayData, setDisplayData] = useState(null);


  useEffect(() => {
  
    if (selectedLinks && currentNodeId) {
      const dynamicIds = Object.keys(selectedLinks);
      const matchedData = dynamicIds
        .filter(id => id === currentNodeId)
        .flatMap(id => selectedLinks[id].selectedElement);

      if (matchedData.length > 0) {
        setDisplayData(matchedData);
      } else {
        setDisplayData("No data found");
      }
    }
  }, [selectedLinks]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {heading}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {displayData ? (
          typeof displayData === "string" ? (
            <Typography variant="body2" color="text.secondary">
              {displayData}
            </Typography>
          ) : (
            <List>
              {displayData.map((link, index) => (
                <ListItem key={index} sx={{ mb: 2, borderBottom: "1px solid #ccc" }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold">
                        {link.ContentLinkTitle || "Untitled"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Type:</strong> {link.ContentLinkType || "Unknown"}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )
        ) : (
          <Typography variant="body2" color="text.secondary">
            No links available to display.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ModalComponent;

ModalComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  currentNodeId: PropTypes.string.isRequired,
};
ModalComponent.defaultProps = {
  open: false,
  handleClose: () => {},
  heading: "Modal Title",
  currentNodeId: "",
};
