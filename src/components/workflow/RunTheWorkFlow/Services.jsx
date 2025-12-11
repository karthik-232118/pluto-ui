import { Card, Typography, TextField, Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const DynamicForm = ({ selectedFlow }) => {
  const { name } = useSelector((state) => state.workflow.data); // Redux state for RightSidebar
  // Function to generate dynamic fields based on object keys and values
  const generateDynamicFields = (data) => {
    return Object.keys(data).map((key) => {
      const value = data[key];

      // If the value is an array, render each item as a separate input field
      if (Array.isArray(value)) {
        return (
          <div key={key}>
            <Typography variant="body1">{key}:</Typography>
            {value.map((item, index) => (
              <TextField
                key={index}
                fullWidth
                value={item}
                readOnly
                variant="outlined"
                sx={{ mb: 2 }}
              />
            ))}
          </div>
        );
      }

      // If the value is an object (and not null), recursively generate its fields
      if (typeof value === "object" && value !== null) {
        return (
          <div key={key}>
            <Typography variant="h6">{key}:</Typography>
            <Box sx={{ pl: 2 }}>{generateDynamicFields(value)} </Box>
          </div>
        );
      }

      // For other primitive values, display a read-only input field
      return (
        <div key={key}>
          <Typography variant="body1">{key}:</Typography>
          <TextField
            fullWidth
            value={value}
            readOnly
            variant="outlined"
            sx={{ mb: 2 }}
            disabled
          />
        </div>
      );
    });
  };

  return (
    <Card sx={{ p: 3, mt: 2 }}>
      {/* Check if DetailsProperties is available */}
      {selectedFlow?.DetailsProperties ? (
        <>
          <Typography variant="h5">{selectedFlow}</Typography>

          {/* Render DetailsProperties fields */}
          <Box sx={{ pl: 2 }}>
            {generateDynamicFields(selectedFlow.DetailsProperties)}
          </Box>
        </>
      ) : (
        <Typography>No DetailsProperties available.</Typography>
      )}
    </Card>
  );
};

export default DynamicForm;
