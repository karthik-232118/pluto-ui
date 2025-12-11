import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Select,
  MenuItem,
  FormGroup,
  TextField,
  Autocomplete,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CopyWorkFlow, CreateFlow, GetUserList } from "../../../store/flow/action";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  height: "auto", // Fixed height
  overflowY: "none", // Handle overflow
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
};

const inputStyle = {
  width: "100%",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};

const NewFlow = ({ open, onClose, editdata }) => {
  // State to hold the input values
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const userList = useSelector((state) => state.workflow.userList);
  const [formdata, setFormData] = useState({
    FlowName: "",
    FlowDescription: "",
    OwnerID: null,
    OwnerEmail: null,
    OwnerName: null,
    AccessStartDate: null,
    AccessEndDate: null,
    CreatedBy: localStorage.getItem("user_id"),
    IsActive: true,
    ExecutionType: "single",
    IsAllowMultiUsers: true,
  });

  const [errors, setErrors] = useState({
    FlowName: "",
    FlowDescription: "",
    OwnerID: "",
  });

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const htmlTagPattern = /<.*?>/g;

    if (htmlTagPattern.test(value)) {
      // Clear the field if invalid input is detected
      setFormData((prevData) => ({
        ...prevData,
        [name]: "", // Clear the invalid input
      }));
      // Display an error message using toast
      toast.error("HTML or script tags are not allowed.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  // Validate form fields
  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {
      FlowName: "",
      FlowDescription: "",
      OwnerID: "",
    };

    if (!formdata.FlowName) {
      newErrors.FlowName = "Flow Name is required";
      formIsValid = false;
    }

    if (!formdata.FlowDescription) {
      newErrors.FlowDescription = "Flow Description is required";
      formIsValid = false;
    }


    setErrors(newErrors);
    return formIsValid;
  };

  useEffect(() => {
    if (open) {
      if (!userList.length) {
        console.log("UserList NF");
        dispatch(
          GetUserList({
            SearchString: "",
            Limit: 1000,
            Page: 1,
          })
        );
      }
      setFormData({
        FlowName: editdata?.FlowName ? editdata?.FlowName + (editdata?.Action === 'Copy' ? ' Copy' : '') : "",
        FlowDescription: editdata?.FlowDescription || "",
        OwnerID: editdata?.OwnerID || null,
        AccessStartDate: editdata?.AccessStartDate || null,
        AccessEndDate: editdata?.AccessEndDate || null,
        OwnerEmail: editdata?.OwnerEmail || null,
        OwnerName: editdata?.OwnerName || null,
        CreatedBy: localStorage.getItem("user_id"),
        IsActive: editdata?.IsActive || true,
        IsAllowMultiUsers: editdata?.IsAllowMultiUsers || true,
        ExecutionType: editdata?.ExecutionType || "single",
      });
    }
  }, [open, editdata]);

  // Handle form submission
  const handleSave = async () => {
    if (validateForm()) {
      const data = {
        FlowID: editdata?.FlowID || null,
        FlowName: formdata.FlowName,
        FlowDescription: formdata.FlowDescription,
        AccessStartDate:
          new Date().toISOString().slice(0, 10) ===
            formdata.AccessStartDate?.slice(0, 10)
            ? new Date().toISOString()
            : formdata.AccessStartDate,
        AccessEndDate: new Date(formdata.AccessEndDate).setHours(
          23,
          59,
          59,
          999
        ),
        OwnerID: formdata.OwnerID,
        OwnerEmail: formdata.OwnerEmail,
        OwnerName: formdata.OwnerName,
        CreatedBy: formdata.CreatedBy,
        IsActive: formdata.IsActive,
        ExecutionType: formdata.ExecutionType,
        IsAllowMultiUsers: formdata.IsAllowMultiUsers,
      };
      if (editdata?.Action === 'Copy') {
        const res = await dispatch(CopyWorkFlow(data));
        console.log(res)
        if (res.meta.requestStatus === "fulfilled") {
          onClose();
        }
      } else {
        const res = await dispatch(CreateFlow(data));
        if (res.meta.requestStatus === "fulfilled") {
          onClose();
        }
      }
    }
  };
  return (
    <div>
      <Modal open={open}>
        <Box sx={style}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {editdata ? editdata?.Action === 'Copy' ? t("copy_flow") : t("edit_flow") : t("create_new_flow")}
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              <FormGroup sx={{ marginBottom: "1rem" }}>
                <Typography variant="subtitle" fontWeight={600}>
                  {t("flow_name")} <span className="error">*</span>
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  style={inputStyle}
                  placeholder={t("placeholder_flow_name")}
                  value={formdata.FlowName}
                  name="FlowName"
                  onChange={handleInputChange}
                  error={!!errors.FlowName}
                  helperText={errors.FlowName}
                />
              </FormGroup>
              <FormGroup sx={{ marginBottom: "1rem" }}>
                <Typography variant="subtitle" fontWeight={600}>
                  {t("flow_description")} <span className="error">*</span>
                </Typography>

                <TextField
                  variant="outlined"
                  size="small"
                  multiline
                  rows={4}
                  style={inputStyle}
                  placeholder={t("placeholder_flow_description")}
                  value={formdata.FlowDescription}
                  name="FlowDescription"
                  onChange={handleInputChange}
                  error={!!errors.FlowDescription}
                  helperText={errors.FlowDescription}
                />
              </FormGroup>
              <FormGroup sx={{ marginBottom: "1rem" }}>
                <Autocomplete
                  id="user-autocomplete"
                  options={userList}
                  size="small"
                  value={
                    editdata?.OwnerID
                      ? userList.find(
                        (user) => user.UserID === editdata.OwnerID
                      )
                      : null
                  }
                  getOptionLabel={(option) =>
                    `${`${option?.UserFirstName} ${option?.UserMiddleName} ${option?.UserLastName}`.trim()} ( ${option.UserEmail
                    } )`
                  }
                  fullWidth
                  onChange={(e, value) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      OwnerID: value?.UserID,
                      OwnerEmail: value?.UserEmail,
                      OwnerName: `${value?.UserFirstName} ${value?.UserMiddleName} ${value?.UserLastName}`,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose Owner"
                      variant="outlined"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  )}
                />
              </FormGroup>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <FormGroup sx={{ marginBottom: "1rem", width: "50%" }}>
                  <Typography variant="subtitle" fontWeight={600}>
                    {t("access_start_date")}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="date"
                    style={inputStyle}
                    value={formdata.AccessStartDate?.slice(0, 10)}
                    name="AccessStartDate"
                    onChange={handleInputChange}
                    error={!!errors.AccessStartDate}
                    helperText={errors.AccessStartDate}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                      max: formdata.AccessEndDate
                        ? formdata.AccessEndDate
                        : null,
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </FormGroup>
                <FormGroup sx={{ marginBottom: "1rem", width: "50%" }}>
                  <Typography variant="subtitle" fontWeight={600}>
                    {t("access_end_date")}
                  </Typography>
                  <TextField
                    variant="outlined"
                    // label="Access End Date"
                    size="small"
                    type="date"
                    style={inputStyle}
                    value={formdata.AccessEndDate?.slice(0, 10)}
                    disabled={!formdata.AccessStartDate}
                    name="AccessEndDate"
                    onChange={handleInputChange}
                    error={!!errors.AccessEndDate}
                    helperText={errors.AccessEndDate}
                    inputProps={{
                      min: formdata.AccessStartDate
                        ? formdata.AccessStartDate
                        : new Date().toISOString().split("T")[0],
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </FormGroup>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <FormGroup sx={{ marginBottom: "1rem", width: "50%" }}>
                  <Typography variant="subtitle" fontWeight={600}>
                    Execution Type <span className="error">*</span>
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={formdata.ExecutionType}
                    onChange={handleInputChange}
                    name="ExecutionType"
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="multiple">Multiple</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                  </Select>
                </FormGroup>
                <FormGroup sx={{ marginBottom: "1rem", width: "50%", pt: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formdata?.IsAllowMultiUsers}
                        onChange={handleSwitchChange}
                        name="IsAllowMultiUsers"
                      />
                    }
                    label="Assign Multiple User"
                  />
                </FormGroup>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "1rem" }}>
            <Box sx={{ display: "flex", justifyContent: "end", gap: "1rem" }}>
              <Button variant="outlined" color="inherit" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button variant="contained" onClick={handleSave}>
                {t("save")}
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </Modal>
    </div>
  );
};

export default NewFlow;
