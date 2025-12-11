import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormGroup, TextField, Typography } from "@mui/material";
import { updateConfigData } from "../../../store/flow/slice";
import { BASE_URL } from "../../../config/urlConfig";
import PropTypes from "prop-types";


const Properties = ({ selectedImage, handleFileChange }) => {
  const [titleError, setTitleError] = useState(false); // new state
const [titleHelperText, setTitleHelperText] = useState(""); // optional helper message

  const { configData } = useSelector((state) => state.workflow);
  const { id } = useSelector((state) => state.workflow.data);

  const dispatch = useDispatch();

  const forbiddenPatterns = /(script|on\w+|javascript:|<[^>]+>)/gi;

  const onHandleChanage = (e) => {
    const { name, value } = e.target;
  
    if (name === "title") {
      if (forbiddenPatterns.test(value)) {
     
        return;
      } else {
        setTitleError(false);
        setTitleHelperText("");
      }
    }
  
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          [name]: value,
        },
      })
    );
  
  
   
  };
 
  
  
  return (
    <Box sx={{ padding: "12px", width: "calc(100% - 50px)" }}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#f9f9f9",
          height: "100%",
          width: "100%",
        }}
      >
        {/* Node Label */}
        <FormGroup>
          <Typography
            sx={{
              marginBottom: "0",
            }}
            variant="caption"
          >
            Title <span className="error">*</span>
          </Typography>
          <TextField
            className="text_input_properties_multiline"
            value={configData[id]?.title}
            variant="outlined"
            name="title"
            onChange={onHandleChanage}
            multiline
            minRows={1}
            maxRows={3}
            error={titleError}
            helperText={titleError ? titleHelperText : ""}
          />
        </FormGroup>

 

        {/* Background Color */}
        <TextField
          type="color"
          name="color"
          label="Background Color"
          value={configData[id]?.color}
          onChange={onHandleChanage}
          variant="outlined"
          className="text_input_properties"
        />

        <TextField
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          variant="outlined"
          className="text_input_properties"
        />

        {selectedImage[id]?.link && (
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <img
              src={`${BASE_URL}/${selectedImage[id].link}`}
              alt="Preview"
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Properties;

Properties.propTypes = {
  selectedImage: PropTypes.object.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

