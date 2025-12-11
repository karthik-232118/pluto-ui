import { useState } from "react";
import { Box } from "@mui/material";
import FormHeader from "./FormHeader";
import FormBuilder from "./FormBuilder";
import FormPreview from "./FormPreview";
import ConfirmationDialog from "./ConfirmationDialog";

import "./index.css";

const CreateForm = () => {
  const [formBuilderData, setFormBuilderData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data) => {
    setFormBuilderData(data.task_data);
  };

  const togglePreview = () => setIsPreview(!isPreview);

  const handleOpenDialog = () => setIsDialogOpen(true);

  const handleCloseDialog = () => {
    if (!isSubmitting) setIsDialogOpen(false);
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", formBuilderData);
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <FormHeader
        isPreview={isPreview}
        handleOpenDialog={handleOpenDialog}
        togglePreview={togglePreview}
        isSubmitting={isSubmitting}
        formBuilderData={formBuilderData}
      />
      {isPreview ? (
        <FormPreview formBuilderData={formBuilderData} />
      ) : (
        <FormBuilder
          formBuilderData={formBuilderData}
          onFormDataChange={handleFormDataChange}
        />
      )}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        formBuilderData={formBuilderData}
      />
    </Box>
  );
};

export default CreateForm;
