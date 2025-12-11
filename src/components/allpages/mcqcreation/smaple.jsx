
import  { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Switch,
  Divider,
  FormControlLabel,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import {
  GetMcqsCreationList,
  GetMcqsAdd,
} from "../../../store/mcqcreationlist/action";
import DraggableSection from "./DraggableSection";
import mcqcreation from "../../../assets/image/MCQ/mcqcreation.png";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import puls from "../../../assets/svg/TestMCQ/puls.svg";
import backButton from "../../../assets/svg/McqQuestionsPage/back-button.svg";
import threedoticon from "../../../assets/svg/TestMCQ/threedoticon.svg";

const TestMCQCreation = () => {
  const dispatch = useDispatch();
  const [showDraggable, setShowDraggable] = useState(true); // State to control DraggableSection visibility
  const [newMCQ, setNewMCQ] = useState({
    QuestionHeading: "",
    QuestionText: "",
    AnswerList: [{ OptionText: "", IsCorrect: false }],
  });

  const { mcqcreationlist, mcqaddresult, error } = useSelector(
    (state) => state.mcqcreationlist
  );

  // Load MCQ creation list
  useEffect(() => {
    const requestBody = {
      TestMCQID: "c587afde-1b70-4dd1-a5cb-fdaf4f3c2e3c", // Replace with actual TestMCQID
    };
    dispatch(GetMcqsCreationList(requestBody));
  }, [dispatch]);

  const handleClickOpen = () => {
    setShowDraggable(false); // Hide the DraggableSection
  };

  const handleClose = () => {
    setShowDraggable(true); // Show the DraggableSection
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMCQ({ ...newMCQ, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newMCQ.AnswerList];
    updatedOptions[index].OptionText = value;
    setNewMCQ({ ...newMCQ, AnswerList: updatedOptions });
  };

  const handleAddOption = () => {
    setNewMCQ({
      ...newMCQ,
      AnswerList: [...newMCQ.AnswerList, { OptionText: "", IsCorrect: false }],
    });
  };

  const handleSave = () => {
    const requestBody = {
      TestMCQID: "c587afde-1b70-4dd1-a5cb-fdaf4f3c2e3c",
      QuestionHeading: newMCQ.QuestionHeading,
      QuestionText: newMCQ.QuestionText,
      AnswerList: newMCQ.AnswerList,
    };
    dispatch(GetMcqsAdd(requestBody)); // Dispatch the action to add MCQ
    handleClose(); // Close dialog and show the DraggableSection again
  };

  // Logging responses
  useEffect(() => {
    if (mcqaddresult) {
      console.log("MCQ Add Response: ", mcqaddresult);
    }
    if (error) {
      console.error("Error: ", error);
    }
  }, [mcqaddresult, error]);

  return (
    <Box>
      <Box
        className="back-icon"
        style={{ backgroundColor: "#fff", height: "70px" }}
      >
        <img src={backButton} alt="Back" style={{ marginTop: "-5px" }} />
        <Button onClick={handleSave}>Publish</Button>
      </Box>
      <Box style={{ margin: "25px" }}>
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ flexGrow: 1, padding: 1 }}>
            <Grid container spacing={6}>
              {/* Left Grid (Questions List) */}
              <Grid item xs={12} md={3} style={{ height: "100%" }}>
                <Box
                  sx={{
                    bgcolor: "#fff",
                    padding: 2,
                    borderRadius: "12px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="b"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      QUESTIONS ({mcqcreationlist?.data?.length || 0})
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ color: "#3D54CD" }}
                      onClick={handleClickOpen} // Open Dialog
                    >
                      <img src={puls} alt="" />
                    </IconButton>
                  </Box>

                  {/* List of Questions */}
                  {mcqcreationlist?.data?.map((questionData, index) => (
                    <Box
                      key={questionData.QuestionID}
                      sx={{
                        bgcolor: "#F2F4FE",
                        borderRadius: 2,
                        padding: 1.5,
                        marginBottom: 1.5,
                        boxShadow: 1,
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "100px",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "24px",
                            height: "24px",
                            border: "2px solid #3D54CD",
                            borderRadius: "50%",
                            color: "#3D54CD",
                            fontWeight: 500,
                            mr: 1,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, flex: 1, color: "#333" }}
                        >
                          {questionData.QuestionText.length > 20
                            ? `${questionData.QuestionText.slice(0, 20)}...`
                            : questionData.QuestionText}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#7E8CA0" }}>
                          N/A
                        </Typography>
                        <IconButton size="small">
                          <MoreHorizIcon sx={{ color: "#7E8CA0" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}

                  {/* Result Screen Section */}
                  <Paper
                    sx={{
                      padding: 2,
                      marginTop: "auto",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography variant="p" style={{ fontWeight: "500" }}>
                      Result Screen
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#667085" }}>
                      Set your passed / failed message
                    </Typography>
                  </Paper>
                </Box>
              </Grid>

              {/* Right Grid (Draggable Sections) */}
              <Grid item xs={12} md={9}>
                {!showDraggable ? null : (
                  <DraggableSection mcqcreationlist={mcqcreationlist?.data} />
                )}
              </Grid>
            </Grid>
          </Box>
        </DndProvider>

        {/* Dialog content */}
        <Box
          sx={{
            display: showDraggable ? "none" : "block",
            padding: 2,
            marginTop: "-125rem",
            marginLeft: "20rem",
            
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              padding: 2,
              borderRadius: "12px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Select
                value="Multiple Choice"
                sx={{
                  width: "200px",
                  height: "35px",
                  backgroundColor: "#F2F4FE",
                  borderRadius: "4px",
                  color: "#3B82F6",
                  border: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              </Select>
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{ marginRight: 1, color: "#3B82F6", fontWeight: "450" }}
                >
                  REQUIRED
                </Typography>
                <Switch />
                <IconButton>
                  <img src={threedoticon} alt="options" />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Question Heading"
                type="text"
                name="QuestionHeading"
                // fullWidth
                variant="outlined"
                value={newMCQ.QuestionHeading}
                onChange={handleInputChange}
              />
              <Grid sx={{ mt: 2 }} container>
                <Grid
                  item
                  xs={9}
                  sx={{
                    backgroundColor: "#FBFBFB",
                    height: "160px",
                    padding: "16px 24px",
                    borderRadius: "8px",
                    gap: "12px",
                    opacity: 1,
                  }}
                >
                  <TextField
                    name="QuestionText"
                    fullWidth
                    variant="standard"
                    value={newMCQ.QuestionText}
                    onChange={handleInputChange}
                    placeholder="Type your question here..."
                    InputProps={{
                      disableUnderline: true, // Removes the underline (border)
                      style: {
                        backgroundColor: "#FBFBFB",
                        border: "none",
                        boxShadow: "none",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <img
                      src={mcqcreation}
                      alt="Question Image"
                      style={{ width: "200px", borderRadius: "8px" }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center">
                {/* CHOICES Title */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "500",
                    color: "#7E8CA0", // Use gray color similar to the screenshot
                    marginRight: 2,
                  }}
                >
                  Choices
                </Typography>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: 30, marginRight: 2 }}
              />

              <FormControlLabel
                control={<Switch />}
                label="Multiple Answer"
                labelPlacement="start" // Place label on the left, switch on the right
                sx={{
                  marginRight: 4, // Adjust spacing between elements
                  fontWeight: "500",
                  color: "#000", // Dark text color for labels
                }}
              />
              </Box>
              </Box>
              {newMCQ.AnswerList.map((option, index) => (
                <TextField
                  key={index}
                  margin="dense"
                  label={`Option ${index + 1}`}
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={option.OptionText}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
              <Button onClick={handleAddOption}>Add Option</Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
            
              <Button >Save</Button>
              
            </DialogActions>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TestMCQCreation;