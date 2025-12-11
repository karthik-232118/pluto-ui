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
import { ExecuteStep, GetPerveData } from "../../../store/flow/action";
import { useParams } from "react-router-dom";
import PrviouseData from "./PrviouseData";
import { autoBatchEnhancer } from "@reduxjs/toolkit";

const PrevDataAndDynamicForm = () => {
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});
  const { getpervData } = useSelector((state) => state.workflow);
  const params = useParams();
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      GetPerveData({
        ExecutionFlowID: params?.id,
        ShapeID: params.nodeId,
      })
    );
    setErrors({});
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (getpervData && getpervData?.data?.form) {
      setFormData(getpervData?.data?.form);
      const initialFormData = getpervData?.data?.form.reduce((acc, field) => {
        acc[field.label] = ""; // Initialize each field with an empty string
        return acc;
      }, {});
      setFormValues(initialFormData);
    }
  }, [getpervData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("ExecutionFlowID", params?.id);
    formDataToSend.append("ShapeID", params.nodeId);
    formDataToSend.append("UserID", params.userid);
    formDataToSend.append("CreatedBy", localStorage.getItem("user_id"));

    Object.keys(formValues).forEach((key) => {
      if (formValues[key] instanceof File) {
        formDataToSend.append(key, formValues[key], formValues[key].name);
      } else {
        formDataToSend.append(key, formValues[key]);
      }
    });

    const res = await dispatch(ExecuteStep(formDataToSend));
    if (res.payload) {
      window.close();
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
            required={item.required}
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
            required={item.required}
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
            required={item.required}
            onChange={handleFileChange}
            type="file"
            error={!!errors[item.label]}
            sx={{ marginBottom: "1rem", width: "100%" }}
          />
        );

      default:
        return null;
    }
  };
  const handleSkip = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("ExecutionFlowID", params?.id);
    formDataToSend.append("ShapeID", params.nodeId);
    formDataToSend.append("CreatedBy", "3fa85f64-5717-4562-b3fc-2c963f66afa6");
    formDataToSend.append("Skipped", true);
    const res = await dispatch(ExecuteStep(formDataToSend));
    if (res.payload) {
      window.close();
    }
  };

  return (
    <div className="flowpage">
      <Card
        sx={{
          width: "100%",
          padding: "1rem",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            margin:"24px 120px 0 120px"
          }}
        >
          <PrviouseData />
        </Box>
        {formData?.length > 0 ? (
          <Container
            sx={{
              border: "1px solid #ccc",
              gap: "1rem 0",
              borderRadius: "8px",
              padding: "1rem",
            }}
            component={Card}
          >
            <Typography variant="h6">{getpervData.data.title}</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {formData?.map((item) => {
                  return (
                    <Grid item md={6} key={item?.label}>
                      <FormGroup sx={{ margin: 1 }}>
                        <FormLabel>
                          {item?.label}
                          {item?.required && (
                            <span style={{ color: "red" }}>*</span>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ marginTop: "1rem" }}
                >
                  Submit
                </Button>
                {getpervData?.data?.isSkipable ? (
                  <Button
                    onClick={handleSkip}
                    variant="outlined"
                    sx={{
                      marginTop: "1rem",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    Skip
                  </Button>
                ) : null}
              </Box>
            </form>
          </Container>
        ) : (
          <Typography variant="h6">No form data found</Typography>
        )}
      </Card>
    </div>
  );
};

export default PrevDataAndDynamicForm;
