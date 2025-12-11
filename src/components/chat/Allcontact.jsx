import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import SearchBox from "./SearchBox";
import { GetContactList } from "../../store/elements/action";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
const formatTime = (time) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(time)) / (1000 * 60));
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr`;
  return new Date(time).toLocaleDateString();
};
const Allcontact = ({ setSelectedContact }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { allContacts } = useSelector((state) => state?.elements);
  const chatUserList = useSelector((state) => state?.chat?.chatUserList);
  const [contacts, setContacts] = React.useState([]);
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
  useEffect(() => {
    dispatch(GetContactList({ ModuleID: elementId() }));
  }, []);
  useEffect(() => {
    setContacts(allContacts);
  }, [allContacts]);
  useEffect(() => {
    if (chatUserList?.[elementId()]) {
      setContacts(chatUserList[elementId()]);
    }
  }, [chatUserList]);

  return (
    <>
      <Box className="contact-list">
        <Box className="chats-header">
          <Typography variant="h6">{t("chats")}</Typography>
        </Box>
        <SearchBox />
        {contacts?.map((contact, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                gap: "1rem",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                },
              }}
              onClick={() => setSelectedContact(contact?.UserID)}
              className="contact-item"
            >
              <Avatar
                src={contact.UserPhoto}
                alt={contact.name}
                style={{ width: 30, height: 30, borderRadius: "50%" }}
              />
              <Box>
                <div className="chat-title">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >{`${contact?.UserFirstName} ${contact?.UserLastName}`}</Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTime(contact?.LastMessageDate)}
                  </Typography>
                </div>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  sx={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {contact?.LastMessage?.slice(0, 20)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default Allcontact;

Allcontact.propTypes = {
  setSelectedContact: PropTypes.func.isRequired,
};
Allcontact.defaultProps = {
  setSelectedContact: () => {},
};
