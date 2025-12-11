import  { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Chip,
  FormGroup,
} from "@mui/material";
import { pinElementsApi } from "../../../services/enterprise/Enterprise";
import link from "../../../assets/svg/flowpage/link.svg";
import {
  AddCircleOutlineOutlined,
  Remove,
  Search,
} from "@mui/icons-material"; // Import Remove icon
import Sops from "../../../assets/svg/BPMN/SOPsFileIcon.svg";
import trs from "../../../assets/svg/BPMN/videoIcon.svg";
import doc from "../../../assets/svg/SideBar/book-open.svg";
import mcq from "../../../assets/svg/SideBar/edit.svg";
import tes from "../../../assets/svg/SideBar/monitor.svg";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLinks } from "../../../store/FlowWithSOP/flowWithSop";

const Attachment = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [expanded, setExpanded] = useState(false); // Track whether the accordion is expanded
  const [apiData, setApiData] = useState([]); // Store API data
  const { id } = useSelector((state) => state.workflow.data);
  const { selectedLinks } = useSelector((state) => state.flowWithSop);
  const iconMapping = {
    sop: Sops,
    trs: trs,
    doc: doc,
    mcq: mcq,
    tes: tes,
  };
  // const [newLink, setNewLink] = useState({});

  const handleCheckboxChange = (event, contentLink) => {
    // Create a new array based on the current state to avoid mutating the previous state
    let updatedSelectedElement = Array.isArray(
      selectedLinks[id]?.selectedElement
    )
      ? [...selectedLinks[id].selectedElement]
      : [];

    if (event.target.checked) {
      updatedSelectedElement.push(contentLink); // Add the new link to the array if checked
    } else {
      updatedSelectedElement = updatedSelectedElement.filter(
        (link) => link.ContentLink !== contentLink.ContentLink // Remove it if unchecked
      );
    }
    // Dispatch the updated selectedElement to the Redux store
    dispatch(
      setSelectedLinks({
        id: id,
        value: {
          ...selectedLinks[id], // Preserve the rest of the data for the current workflow
          selectedElement: updatedSelectedElement, // Update the selectedElement
        },
      })
    );
  };

  // Function to handle API request
  const handleSearch = async () => {
    if (searchQuery.trim().length < 3 && searchQuery !== "") return; // Return if the search query is less than 3 characters
    const payload = { SearchText: searchQuery, Limit: 20 }; // Prepare the payload with searchQuery
    try {
      const response = await pinElementsApi(payload); // Call the API with the payload
      // console.log("API Response Search Result:", response?.data?.data); // Log the response in the console
      setApiData(response?.data?.data || []); // Update the state with API response
    } catch (error) {
      console.error("Error fetching data:", error); // Handle any errors
    }
  };

  // Optionally, you can trigger the search whenever the searchQuery changes
  useEffect(() => {
    handleSearch(); // Trigger the search API call when the searchQuery is not empty
  }, [searchQuery]);

  const handleSubmit = () => {
    if (linkName.trim() === " " || linkURL.trim() === " ") return;
    let newdata = Array.isArray(selectedLinks[id]?.selectedElement)
      ? [...selectedLinks[id].selectedElement]
      : [];
    newdata.push({
      ContentLinkTitle: linkName,
      ContentLink: decodeURIComponent(linkURL),
      ContentLinkType: "link",
    });
    dispatch(
      setSelectedLinks({
        id: id,
        value: {
          ...selectedLinks[id],
          selectedElement: newdata,
        },
      })
    );
    setLinkName("");
    setLinkURL("");
    setExpanded(false);
  };

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded); // Toggle the expanded state
  };

  const handleRemoveLink = (linkToRemove) => {
    // Remove the link from the selectedElement array
    dispatch(
      setSelectedLinks({
        id: id,
        value: {
          ...selectedLinks[id],
          selectedElement: selectedLinks[id]?.selectedElement.filter(
            (link) => link.ContentLink !== linkToRemove.ContentLink
          ),
        },
      })
    );
  };
  console.log("selectedLinks", selectedLinks);
  return (
    <Box sx={{ width: "90%" }}>
      <Box
        sx={{
          padding: "12px",
        }}
      >
        <Typography variant="caption" fontWeight={"400"}>
          Choose Links
        </Typography>
        <Accordion
          sx={{
            border: "2px solid #2196F3",
            backgroundColor: "#2196F30A",
            borderRadius: "10px", // Make the border radius larger for a round shape
            alignContent: "center",
            alignItems: "center",
            "&.MuiAccordion-root": {
              borderRadius: "10px", // Apply rounded border to the inner accordion too
            },
          }}
          expanded={expanded}
          onChange={handleChange}
        >
          <AccordionSummary
            sx={{
              margin: 0,
              alignItems: "center",
            }}
            expandIcon={
              expanded ? (
                <Remove
                  sx={{
                    color: "#2196F3",
                    alignItems: "center",
                    fontSize: "16px",
                  }}
                /> // Use - icon when expanded
              ) : (
                <AddCircleOutlineOutlined
                  sx={{
                    color: "#2196F3",
                    alignItems: "center",
                    fontSize: "16px",
                  }}
                /> // Use + icon when collapsed
              )
            }
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography
              sx={{
                color: "#2196F3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 !importent",
              }}
            >
              <img
                src={link}
                alt="Link Icon"
                style={{ marginRight: "8px", width: "20px", height: "20px" }}
              />
              <span style={{ fontWeight: "400", fontSize: "14px" }}>
                Add/Edit Links
              </span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <Typography variant="caption" marginBottom={1} marginTop={1}>
                {" "}
                Link Name
              </Typography>
              <TextField
                id="linkName"
                variant="outlined"
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Link Name"
                className="text_input_properties"
                value={linkName}
              />
            </FormGroup>
            <FormGroup>
              <Typography variant="caption" marginBottom={1} marginTop={1}>
                {" "}
                Link URL
              </Typography>
              <TextField
                id="linkURL"
                variant="outlined"
                onChange={(e) => setLinkURL(e.target.value)}
                className="text_input_properties"
                placeholder="https://example.com"
                marginBottom={1}
                value={linkURL}
              />
            </FormGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                width: "100%",
                backgroundColor: "#2196F3",
                color: "#fff",
                marginTop: "1rem",
              }}
            >
              Submit
            </Button>
          </AccordionDetails>
        </Accordion>
        <TextField
          className="text_input_properties"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on change
          variant="outlined"
          placeholder="Search for sop"
          sx={{ mb: 2, mt: 2 }} // Adjust the height as needed
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ marginLeft: "auto" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {selectedLinks[id]?.selectedElement?.map((link) => (
            <Chip
              key={link.ContentLink}
              label={link.ContentLinkTitle}
              onDelete={() => handleRemoveLink(link)}
              sx={{
                marginRight: 1,
                marginBottom: 1,
                color: "#EF6C00",
                border: "1px solid #EF6C00",
                backgroundColor: "#fff",
                borderRadius: "8px",
              }}
            />
          ))}
        </Box>

        {/* Display Links with Icons and Checkboxes */}
        <Box>
          {apiData.length === 0 ? (
            <Typography variant="caption">No data found</Typography>
          ) : (
            apiData.map((item) => (
              <Box
                key={item.ContentLink}
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <img
                  src={iconMapping[item.ContentLinkType]}
                  alt={`${item.ContentLinkType} icon`}
                  style={{ marginRight: "20px" }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    marginRight: "20px",
                    marginTop: "10px",
                    fontWeight: "400",
                  }}
                >
                  {item.ContentLinkTitle}
                </Typography>

                <FormControlLabel
                  sx={{
                    marginLeft: "auto",
                    marginRight: "0",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "12px",
                    },
                  }}
                  control={
                    <Checkbox
                      checked={
                        selectedLinks[id]?.selectedElement.some(
                          (link) => link.ContentLink === item.ContentLink
                        ) || false
                      }
                      sx={{
                        height: "14px",
                      }}
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                  }
                />
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Attachment;
