import  { useState } from "react";
import axios from "axios"; // Import axios for API calls
import {

  Box,
  TextField,
  Card,
  Typography,

  CircularProgress,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import Checkcircle from "../../../assets/svg/navbar/Checkcircle.svg";
import gptSend from "../../../assets/svg/navbar/gptSend.svg";
import Aisvg from "../../../assets/svg/navbar/AisvgBlue.svg";
import { AI_URL } from "../../../config/urlConfig";

const SideBarAI = () => {
  const [search, setSearch] = useState(""); // User input
  const [loading, setLoading] = useState(false); // API loader state
  const [message, setMessage] = useState(""); // Success or Error Message
  const [messageColor, setMessageColor] = useState(""); // Color for message (green/red)
  const [conversation, setConversation] = useState([]); // Stores question and answer

  // Function to fetch API response
  const handleGetResponse = async () => {
    if (!search) return;

    setLoading(true);
    setConversation([{ type: "question", content: search }]); // Store user query

    const payload = { prompt: search };
    try {
      const res = await axios.post(AI_URL, payload);
      const answer = res.data?.qa?.[0]?.answer || "No response found.";

      setMessage("Successfully generated response");
      setMessageColor("green");

      setConversation([
        { type: "question", content: search },
        { type: "answer", content: answer },
      ]);
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      setMessageColor("red");

      setConversation([
        { type: "question", content: search },
        { type: "answer", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setSearch("");
      setLoading(false);
    }
  };
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGetResponse();
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "1rem" ,marginTop:"100px",bottom :"100px"}}>
      <h1 style={{ textAlign: "center" }}>ClykOps GPT</h1>
      {/* Search Box */}
      <TextField
        placeholder="How can I help...?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: <img src={Aisvg} alt="AI" style={{ width: 20, height: 20, margin: 1 }} />,
          endAdornment: <img src={gptSend} alt="Send" onClick={handleGetResponse} />,
          style: { height: "45px", borderRadius: "8px", width: "100%" },
        }}
      />
      {/* Display "Searched For" Section */}
      {conversation.length > 0 && (
      <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #68CE6D80", // Matches the success border
        backgroundColor: "#68CE6D0A", // Light green background
        marginBottom:"1rem"
      }}
    >
      <Typography variant="body2">
        <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>Searched For: </span>
        <span style={{ color: "black" }}>{conversation[0]?.content}</span>
      </Typography>
    </Box> 
      )}
      {/* Show Loader While Fetching Response */}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", padding: "1rem", borderRadius: "8px", gap: "10px" }}>
          <CircularProgress size={20} sx={{ color: "#FFA500" }} />
          <Typography variant="body2" sx={{ color: "#E65100", fontWeight: "bold" }}>
            Your response is loading...
          </Typography>
        </Box>
      )}

      {/* Success or Error Message */}
      {!loading && message && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            borderRadius: "8px",
            gap: "10px",
            backgroundColor: messageColor === "green" ? "#68CE6D0A" : "#FFEBEE",
            border: `1px solid ${messageColor === "green" ? "#68CE6D80" : "red"}`,
          }}
        >
          {messageColor === "red" ? <ErrorOutline sx={{ color: "red" }} /> : <img src={Checkcircle} alt="Success" />}
          <Typography color={messageColor} variant="body2">
            {message}
          </Typography>
        </Box>
      )}

      {/* Display API Response */}
      {!loading &&
        conversation
          .filter((item) => item.type === "answer")
          .map((item, index) => (
            <Card key={index}  sx={{
              padding: "1rem",
              marginTop: "10px",
              borderRadius: "8px",
              height: "300px",
              overflowY: "auto", // Enables vertical scrolling
              scrollbarWidth: "none", // Hides scrollbar for Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Hides scrollbar for Chrome, Safari, Edge
            }}>
              <Typography variant="body1" sx={{ fontWeight: "300", fontSize: "14px" }}>
                {item.content}
              </Typography>
            </Card>
          ))}
    </Box>
  );
};

export default SideBarAI;
