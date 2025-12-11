import React, { useState, useEffect } from "react";
import {
  Button,
  FormGroup,
  FormLabel,
  TextField,
  Box,
  Typography,
  FormHelperText,
  Container,
  Grid,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Card,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  ExecuteStep,
  GettflowById,
  ExecuteFlow,
  GetPerveData,
} from "../../../store/flow/action";
import { useNavigate, useParams } from "react-router-dom";
import { classNames } from "@react-pdf-viewer/core";

const DynamicForms = () => {
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});
  const { getflowdatafromId, executeFlowData, getpervData } = useSelector(
    (state) => state.workflow
  );
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GettflowById({ FlowID: params?.id }));
    dispatch(
      GetPerveData({
        ExecutionFlowID: params?.id,
        ShapeID: params.nodeId,
      })
    );
    dispatch(
      ExecuteFlow({
        FlowID: params?.id,
        CreatedBy: localStorage.getItem("user_id"),
      })
    );
    setErrors({});
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (getflowdatafromId && getflowdatafromId.Details) {
      const step1 = getflowdatafromId.Details.find(
        (item) => item?.ShapeID === params.nodeId
      );

      if (step1 && step1.DetailsProperties?.form) {
        setFormData(step1.DetailsProperties.form);

        const initialFormData = step1.DetailsProperties.form.reduce(
          (acc, field) => {
            acc[field.label] = ""; // Initialize each field with an empty string
            return acc;
          },
          {}
        );
        setFormValues(initialFormData);
      }
    }
  }, [getflowdatafromId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(name, files);
    setFormValues((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data for required fields only
    let formErrors = {};
    Object.keys(formValues).forEach((key) => {
      const field = formData.find((item) => item.label === key);

      if (field?.required && formValues[key] === "") {
        formErrors[key] = "This field is required";
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const step1 = getflowdatafromId?.Details?.find(
      (item) => item?.ShapeID === params.nodeId
    );

    const formDataToSend = new FormData();
    formDataToSend.append(
      "ExecutionFlowID",
      executeFlowData?.executionFlow?.ExecutionFlowID
    );
    formDataToSend.append("ShapeID", params.nodeId);
    formDataToSend.append("CreatedBy", "3fa85f64-5717-4562-b3fc-2c963f66afa6");

    Object.keys(formValues).forEach((key) => {
      formDataToSend.append(key, formValues[key]);
    });
    const res = await dispatch(ExecuteStep(formDataToSend));
    if (res.payload) {
      navigate(`/run/${params.id}`);
    }
  };

  const renderInputField = (item) => {
    switch (item.type) {
      case "text":
      case "number":
      case "date":
      case "email":
        return (
          <TextField
            type={item.type}
            name={item.label}
            placeholder={item.placeholder}
            required={item.required} // Dynamically set required based on item.required
            value={formValues[item.label] || ""}
            onChange={handleChange}
            error={!!errors[item.label]}
            sx={{ marginBottom: "1rem", width: "100%" }}
          />
        );
      case "Select":
        return (
          <Select
            name={item.label}
            value={formValues[item.label] || ""}
            onChange={handleChange}
            fullWidth
            error={!!errors[item.label]}
            sx={{ marginBottom: "1rem", width: "100%" }}
          >
            <MenuItem value="">{item.placeholder}</MenuItem>
            {item.options &&
              item.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            name={item.label}
            value={formValues[item.label] || ""}
            onChange={handleChange}
            sx={{ marginBottom: "1rem", width: "100%" }}
          >
            {item.options &&
              item.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues[item.label] || false}
                onChange={handleChange}
                name={item.label}
                sx={{
                  marginBottom: "0.5rem", // Added margin-bottom to the checkbox itself
                  padding: "0.5rem", // Adjust padding if necessary
                }}
              />
            }
            label={item.label}
          />
        );
      case "textarea":
        return (
          <TextField
            name={item.label}
            placeholder={item.placeholder}
            required={item.required} // Dynamically set required based on item.required
            value={formValues[item.label] || ""}
            onChange={handleChange}
            error={!!errors[item.label]}
            multiline
            rows={4}
            sx={{ marginBottom: "1rem", width: "100%" }}
          />
        );
      case "file":
        return (
          <TextField
            name={item.label}
            placeholder={item.placeholder}
            type={item?.type}
            required={item.required}
            onChange={handleFileChange}
            error={!!errors[item.label]}
            sx={{ marginBottom: "1rem", width: "100%" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card sx={{ position: "relative", padding: "1rem", marginTop: "2rem" }}>
      {formData?.length > 0 ? (
        <Container
          sx={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Create Form</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {formData?.map((item) => {
                return (
                  <Grid item md={6} key={item?.label}>
                    <FormGroup sx={{ margin: 1 }}>
                      <FormLabel>
                        {item?.label}
                        {item?.required && (
                          <span style={{ color: "red" }}>*</span> // Show asterisk if required
                        )}
                      </FormLabel>
                      {renderInputField(item)}
                      {errors[item?.label] && (
                        <FormHelperText error>
                          {errors[item?.label]}
                        </FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                );
              })}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "1rem" }}
            >
              Submit
            </Button>
          </form>
        </Container>
      ) : (
        <Typography variant="h6">No form data found</Typography>
      )}
    </Card>
  );
};

export default DynamicForms;
