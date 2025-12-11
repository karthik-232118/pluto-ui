import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Select,
  OutlinedInput,
  Typography,
  Chip,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import keyicon from "../../assets/svg/keypages/keyicon.svg";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./GenerateKey.css";
import { useNavigate } from "react-router";
import keybutton from "../../assets/svg/keypages/keyButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { Keygenreation } from "../../store/keygenreration/action";
import { GetElementsSidebar } from "../../store/elements/action";
import notify from "../../assets/svg/utils/toast/Toast";

const GenerateKey = () => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numAdmins, setNumAdmins] = useState("");
  const [isPerpetual, setIsPerpetual] = useState(false);
  const [isPerpetual2, setIsPerpetual2] = useState(false);
  const [numEndUsers, setNumEndUsers] = useState("");
  const [numPowerUsers, setNumPowerUsers] = useState("");
  const [ClientName, setClientName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { elementsSidebar } = useSelector((state) => state?.elements);

  const handleElementChange = (event) => {
    const {
      target: { value },
    } = event;

    // If value is an array of strings (like ModuleName), map back to objects
    const selectedValues = elementsSidebar.data.filter((element) =>
      value.includes(element.ModuleName)
    );

    setSelectedElements(selectedValues);
  };

  const handleAdminChange = (event) => {
    setNumAdmins(event.target.value);
  };

  const handleClick = async () => {
    const isValid =
      isPerpetual || isPerpetual2
        ? startDate && endDate && numAdmins && ClientName
        : startDate && endDate && numAdmins && ClientName && numEndUsers;

    if (!isValid) {
      notify("error", "Please fill in all required fields.");
      return;
    }
    const moduleIds = selectedElements.map((element) => element.ModuleTypeID);
    const payload = {
      OrganizationStructureName: ClientName,
      ModuleTypeIDs: moduleIds,
      NumberOfEndUsers: Number(numEndUsers), // Assuming you still need this for the payload
      PerpetualEndUser: isPerpetual,
      NumberOfProcessOwnerUsers: Number(numPowerUsers), // Assuming you still need this for the payload
      PerpetualProcessOwner: isPerpetual2,
      NumberOfAdminUsers: Number(numAdmins),
      ValidityFrom: startDate.format("YYYY-MM-DD"),
      ValidityTo: endDate.format("YYYY-MM-DD"),
    };

    try {
      const res = await dispatch(Keygenreation(payload));
      if (res) {
        navigate("/key");
      }
    } catch (error) {
      notify("error", "An error occurred while processing your request.");
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(GetElementsSidebar());
  }, []);

  return (
    <div className="container">
      <div className="heading">
        <img src={keyicon} alt="" className="headerimg" />
        <div>
          {/* <Typography variant="h6">Generate Key</Typography> */}
          <Typography variant="h6">License Key Management</Typography>
          {/* <Typography className="title">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </Typography> */}
        </div>
      </div>
      <Divider style={{ margin: "20px 0" }} />
      <div>
        {/* Client Name */}
        <Typography className="input-label" variant="body2">
          Client Name
        </Typography>
        <input
          type="text"
          placeholder="Enter simulation name..."
          className="input-container"
          onChange={(e) => {
            setClientName(e.target.value);
          }}
          value={ClientName}
        />
      </div>
      <div className="flex-container">
        {/* Element Type */}
        <div style={{ flex: 1 }}>
          <Typography className="input-label" variant="body2">
            Element Type
          </Typography>

          {/* Select Input */}
          <Select
            multiple
            value={selectedElements.map((el) => el.ModuleName)} // Correctly map to ModuleName
            onChange={handleElementChange}
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0 ? "Select elements" : selected.join(", ")
            }
            fullWidth
            className="element-select"
            displayEmpty
            inputProps={{ "aria-label": "Select elements" }}
          >
            <MenuItem disabled value="">
              <Typography variant="body1">Select elements</Typography>
            </MenuItem>
            {elementsSidebar?.data?.map((element) => (
              <MenuItem key={element.ModuleName} value={element?.ModuleName}>
                {element.ModuleName}
              </MenuItem>
            ))}
          </Select>
          <div className="chip-container">
            {selectedElements.map((element) => (
              <Chip
                key={element.ModuleTypeID}
                label={element.ModuleName}
                onDelete={() => {
                  setSelectedElements(
                    (prev) =>
                      prev.filter(
                        (el) => el.ModuleTypeID !== element.ModuleTypeID
                      ) // Compare by ModuleTypeID
                  );
                }}
                style={{ backgroundColor: "#F2F4F7", color: "#101828" }}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Number of End Users */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <Typography className="input-label" variant="body2">
            Number of End Users
          </Typography>
          <input
            type="number"
            placeholder="Enter number of end users"
            style={{
              width: "100%",
              height: "48px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
            onChange={(e) => {
              setNumEndUsers(e.target.value);
            }}
            disabled={isPerpetual}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPerpetual}
                onChange={() => setIsPerpetual(!isPerpetual)}
              />
            }
            label="Perpetual"
          />
        </div>

        {/* Number of Power Users */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <Typography className="input-label" variant="body2">
            Number of Power Users
          </Typography>
          <input
            type="number"
            placeholder="Enter number of power users"
            style={{
              width: "100%",
              height: "48px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
            onChange={(e) => {
              setNumPowerUsers(e.target.value);
            }}
            disabled={isPerpetual2}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPerpetual2}
                onChange={() => setIsPerpetual2(!isPerpetual2)}
              />
            }
            label="Perpetual"
          />
        </div>

        {/* Number of Administrators */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <Typography className="input-label" variant="body2">
            Number of Administrators
          </Typography>
          <Select
            value={numAdmins}
            onChange={handleAdminChange}
            displayEmpty
            fullWidth
            style={{
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
            inputProps={{ "aria-label": "Select number of administrators" }}
          >
            <MenuItem value="">
              <Typography variant="body2">
                Select number of administrators
              </Typography>
            </MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </div>
      </div>
      <div className="flex-container">
        {/* Choose Start Date */}
        <div style={{ flex: 1 }}>
          <Typography className="input-label" variant="body2">
            Choose Start Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <CalendarToday style={{ marginRight: "10px" }} />
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>

        {/* Choose End Date */}
        <div style={{ flex: 1 }}>
          <Typography className="input-label" variant="body2">
            Choose End Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <CalendarToday style={{ marginRight: "10px" }} />
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
      {/* Generate Key Button */}
      <div className="centered-button">
        <Button
          variant="contained"
          onClick={() => handleClick()}
          className="generate-button"
        >
          Generate Key{" "}
          <img src={keybutton} alt="" style={{ marginLeft: "8px" }} />
        </Button>
      </div>
    </div>
  );
};

export default GenerateKey;
