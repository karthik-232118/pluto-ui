import {
  Box,
  Button,
 
  List,
  ListItem,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import closeIcon from "../../../assets/svg/BPMN/closeIcon.svg";
import { setImageUrl } from "../../../store/imageSlice/imageSlice";
import PropTypes from "prop-types";

const ImageUploadModal = ({
  isOpen,
  onClose,
  onSave,
  modalHeading,
  debuggingInfo,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedLinks = useSelector((state) => state.clip.selectedLinks);
  const nodeId = useSelector((state) => state.clip.nodeId);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (modalHeading === "Image" && selectedImage) {
      dispatch(setImageUrl(selectedImage));
      onSave(selectedImage);
    } else if (modalHeading === "Clip" && selectedLinks.length > 0) {
      onSave(selectedLinks);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: "absolute",
          top: 300,
        left: 600,
        width: "350px",
        boxShadow: "0.3em 0.3em 0.3em 0.3em lightgrey",
        backgroundColor: "background.paper",
        borderRadius: 2,
        padding: 2,
        zIndex: 1000,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{modalHeading}</Typography>
        <Box
          sx={{ cursor: "pointer" }}
          onClick={onClose}
        >
          <img
            src={closeIcon}
            alt="Close"
            style={{ width: 24, height: 24 }}
          />
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {modalHeading === "Image" ? (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
        </>
      ) : modalHeading === "Clip" ? (
        <List>
          {nodeId === debuggingInfo?.id ? (
            selectedLinks.length > 0 ? (
              selectedLinks.map((item, index) => (
                <ListItem key={index}>
                  <Typography>{item.ContentLinkTitle}</Typography>
                </ListItem>
              ))
            ) : (
              <Typography>No elements found</Typography>
            )
          ) : (
            <Typography>No elements found</Typography>
          )}
        </List>
      ) : null}

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ color: "#000", borderColor: "#000" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ImageUploadModal;

ImageUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  modalHeading: PropTypes.string.isRequired,
  nodeData: PropTypes.object,
  debuggingInfo: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
};

