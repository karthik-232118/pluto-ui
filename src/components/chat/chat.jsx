import  { useEffect, useRef, useState } from "react";
import "./Chat.css"; 
import Send from "../../assets/svg/D&A/Send.svg";
import { Avatar, Box, IconButton, TextField, Typography } from "@mui/material";
import Allcontact from "./Allcontact";
import { useDispatch, useSelector } from "react-redux";
import { GetChatsList, SendMessage } from "../../store/elements/action";
import { BASE_URL } from "../../config/urlConfig";
import Allcaughtup from "../../components/allpages/masterpopups/Allcaughtup";
import { formartTimes } from "../../utils";
import { setReadStatus } from "../../store/chat/slice";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { get_AllChats } = useSelector((state) => state?.elements);
  const incomingChat = useSelector((state) => state?.chat?.message);
  const [chatMessage, setChatMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null); 
  const userId = localStorage.getItem("user_id");
  const user_type = localStorage.getItem("user_type");
  const dispatch = useDispatch();
   const { t } = useTranslation();
  const chatBodyRef = useRef(null); 
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );


  const elementId = () => {
    if (presistStore?.ModuleName === "Document") {
      return presistStore?.DocumentID;
    } else if (presistStore?.ModuleName === "TrainingSimulation") {
      return presistStore?.TrainingSimulationID;
    } else if (presistStore?.ModuleName === "SOP") {
      return presistStore?.SOPID;
    } else if (presistStore?.ModuleName === "TestMCQ") {
      return presistStore?.TestMCQID;
    } else if (presistStore?.ModuleName === "TestSimulation") {
      return presistStore?.TestSimulationID;
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    dispatch(
      GetChatsList({
        ModuleID: elementId(),
        ModuleAccessorID: selectedContact === null ? null : selectedContact,
      })
    );
  }, [dispatch, selectedContact]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessage]);

  useEffect(() => {
    if (incomingChat) {
      setChatMessage((prevMessages) => [...(prevMessages || []), incomingChat]);
      if (selectedContact && user_type === "ProcessOwner") {
        dispatch(
          setReadStatus({ ...incomingChat, ModuleAccessorID: selectedContact })
        );
      } else if (user_type === "User") {
        dispatch(setReadStatus(incomingChat));
      }
    }
  }, [incomingChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

   if (!newMessage.trim()) return; // Prevent sending empty message
    const response = await dispatch(
      SendMessage({
        ModuleID: elementId(),
        Message: newMessage,
        ModuleAccessorID: selectedContact || null,
        MasterVersion: presistStore?.MasterVersion,
      })
    );

    const payload = response.payload.data;
    setChatMessage((prevMessages) => [...prevMessages, payload]); // Update the chat list with the new message
    setNewMessage("");
  };

  useEffect(() => {
    setChatMessage(get_AllChats); // Set the reversed data
  }, [get_AllChats]);
  return (
    <>
      {selectedContact === null && user_type === "ProcessOwner" ? (
        <Allcontact setSelectedContact={setSelectedContact} />
      ) : (
        <div className="chat-container">
          <Box className="chats-header">
            <Typography variant="h6">{t("chats")}
            </Typography>
          </Box>
          <div className="chat-body" ref={chatBodyRef}>
            {chatMessage?.length > 0 ? (
              chatMessage?.map((message, index) => (
                <>
                  <div
                    key={index}
                    className={`chat-message ${
                      message?.SenderID === userId ? "sent" : "received"
                    }`}
                  >
                    {message?.SenderID === userId && (
                      <Avatar
                        src={`${BASE_URL}${message?.RepliedByUser?.UserPhoto}`}
                        className="received-avatar"
                        sx={{ width: 40, height: 40 }}
                      />
                    )}
                    {message?.SenderID !== userId && (
                      <Avatar
                        src={`${BASE_URL}${message?.RepliedByUser?.UserPhoto}`}
                        className="sent-avatar"
                        sx={{ width: 30, height: 30 }}
                      />
                    )}
                    <div className="message-content">
                      <div
                        className={`message-sender-${
                          message?.SenderID === userId ? "received" : "sent"
                        }`}
                      >
                        {`${message?.RepliedByUser?.UserFirstName} ${message?.RepliedByUser?.UserLastName}`}
                      </div>
                      <div className="message-text">{message?.Message}</div>
                    </div>
                  </div>
                  <div
                    className={
                      message?.SenderID === userId
                        ? "message-time-left"
                        : "message-time-right"
                    }
                  >
                    {formartTimes(message?.MessageDate)}
                  </div>
                </>
              ))
            ) : (
              <Allcaughtup image={true} />
            )}
            <div>
              <form className="chat-footer" onSubmit={handleSendMessage}>
                <Avatar src="https://randomuser.me/api/portraits/men/1.jpg" />
                <TextField
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: {
                      fontWeight: "normal",
                    },
                  }}
                  sx={{
                    borderRadius: "8px",
                    paddingLeft: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                    },
                    "& .MuiInputBase-input": {
                      padding: "10px",
                      fontSize: "14px",
                      color: "#333",
                    },
                    "&:focus .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) => theme.palette.primary.main, // Use theme's primary color
                    },
                    "&:focus": {
                      borderColor: (theme) => theme.palette.primary.main, // Use theme's primary color
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 5px rgba(0, 120, 212, 0.5)", // Subtle blue shadow
                    },
                  }}
                />
                <IconButton type="submit">
                  <img src={Send} alt="Send" />
                </IconButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
