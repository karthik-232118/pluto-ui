import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Divider,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  IconButton,
  Chip,
  Fade,
  Paper,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import ReactQuill from "react-quill";
import foldersicon from "../../../assets/svg/notes/folders.svg";
import openfolder from "../../../assets/svg/notes/openfolder.svg";
import date from "../../../assets/svg/notes/date.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAddNote,
  GetNotesList,
  GetUpdateNote,
} from "../../../store/notes/action";
import { dateformatter } from "../../../utils";
import {
  Close,
  Save,
  Update,
  FolderOpen,
  Description,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const NotesPage = ({ onClose }) => {
  const dispatch = useDispatch();
  const notesList = useSelector((state) => state.noteslist.noteslist);
  const addNoteResponse = useSelector(
    (state) => state.noteslist.addNoteResponse
  );
  const elementsSidebar = useSelector(
    (state) => state.elements.elementsSidebar
  );

  const [newNoteMode, setNewNoteMode] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedModuleTypeID, setSelectedModuleTypeID] = useState(null);
  const [selectedModuleName, setSelectedModuleName] = useState("Personal");
  const [selectedNote, setSelectedNote] = useState(null);
  const [editableContent, setEditableContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme?.palette?.primary?.main || "#4A90E2";

  // Fetch notes list
  useEffect(() => {
    const requestBody = selectedModuleTypeID
      ? { ModuleTypeID: selectedModuleTypeID }
      : {};

    dispatch(GetNotesList(requestBody))
      .then((response) => {
        // console.log("API Response notes:", response.payload);
      })
      .catch((error) => {
        console.error("Error fetching notes list:", error);
      });
  }, [selectedModuleTypeID, dispatch]); // Run only once on mount

  useEffect(() => {
    if (notesList && notesList.data && selectedNote) {
      setEditableContent(selectedNote.Content);
    }
  }, [notesList, selectedNote]);
  // Sample JSON data for recent notes, folders, and personal notes
  useEffect(() => {
    // Log the response from the Redux store whenever it changes
    if (notesList) {
      console.log("API ResponseseleList:", notesList);
    }
  }, [notesList]);

  // Log the response to the console
  useEffect(() => {
    if (addNoteResponse) {
      console.log("Add Note API Response:", addNoteResponse);
    }
  }, [addNoteResponse]);

  const folderList = [
    { id: 1, name: "Personal", ModuleTypeID: null }, // No ModuleTypeID for "Personal"
    ...(elementsSidebar?.data
      ?.filter(
        (item) =>
          item.ModuleName === "SOP" ||
          item.ModuleName === "Document" ||
          item.ModuleName === "TrainingSimulation"
      )
      .map((item, index) => ({
        id: index + 2,
        name: item.ModuleName,
        ModuleTypeID: item.ModuleTypeID,
      })) || []),
  ];

  const handleFolderClick = (ModuleTypeID, ModuleName) => {
    console.log("ModuleTypeIDnotes:", ModuleTypeID);
    setSelectedModuleTypeID(ModuleTypeID);
    setSelectedModuleName(ModuleName);
    setSelectedNote(null);
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setEditableContent(note.Content);
    setNewNoteMode(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setNewNoteMode(true);
    setNewNoteTitle(""); // Reset title
    setNewNoteContent(""); // Reset content
  };

  const handleAddNote = () => {
    const requestBody = {
      Title: newNoteTitle,
      Content: newNoteContent,
    };

    dispatch(GetAddNote(requestBody))
      .then(() => {
        setNewNoteMode(false);
        setNewNoteTitle("");
        setNewNoteContent("");
        dispatch(GetNotesList()); // Refresh the notes list
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  };

  const handleUpdateNote = () => {
    if (selectedNote) {
      const requestBody = {
        NoteID: selectedNote.NoteID,
        Content: editableContent,
      };

      dispatch(GetUpdateNote(requestBody))
        .then(() => {
          setEditableContent(""); // Clear content after updating
          setSelectedNote(null); // Deselect note after updating
          setSelectedModuleTypeID(null); // Reset to "Personal"
          setSelectedModuleName("Personal"); // Activate "Personal"
          dispatch(GetNotesList()); // Refresh the notes list
        })
        .catch((error) => {
          console.error("Error updating note:", error);
        });
    }
  };

  // Filter notes based on search query
  const filteredNotes =
    notesList?.data?.filter((note) =>
      note.Title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Grid container spacing={0} sx={{ height: "calc(100vh - 74px)" }}>
      {/* Sidebar */}
      <Grid
        item
        xs={12}
        sm={4}
        md={3}
        sx={{
          position: "relative",
          padding: 3,
          backgroundColor: "#FAFBFC",
          borderRight: "1px solid #E8EAED",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          placeholder={t("hinted_search_text")}
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9AA0A6" }} />
              </InputAdornment>
            ),
            style: {
              backgroundColor: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E8EAED",
              },
              "&:hover fieldset": {
                borderColor: primaryColor,
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor,
                borderWidth: "2px",
              },
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            mb: 3,
            backgroundColor: primaryColor,
            color: "#fff",
            textTransform: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
            "&:hover": {
              backgroundColor: primaryColor,
              boxShadow: "0 4px 12px rgba(74, 144, 226, 0.35)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
          fullWidth
          onClick={handleNewNote} // Trigger the new note mode
        >
          {t("new_note_button")}
        </Button>

        <Typography
          variant="overline"
          sx={{
            mb: 2,
            color: "#5F6368",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          {t("folders_heading")}
        </Typography>

        <List sx={{ flex: 1, overflow: "auto" }}>
          {folderList.map((folder) => (
            <ListItem
              key={folder.id}
              button
              onClick={() =>
                handleFolderClick(folder.ModuleTypeID, folder.name)
              }
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                backgroundColor:
                  selectedModuleTypeID === folder.ModuleTypeID
                    ? `${primaryColor}15`
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    selectedModuleTypeID === folder.ModuleTypeID
                      ? `${primaryColor}20`
                      : "#F1F3F4",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {selectedModuleTypeID === folder.ModuleTypeID ? (
                  <FolderOpen sx={{ color: primaryColor }} />
                ) : (
                  <img src={foldersicon} alt="" style={{ width: 24 }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={folder.name}
                primaryTypographyProps={{
                  sx: {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color:
                      selectedModuleTypeID === folder.ModuleTypeID
                        ? primaryColor
                        : "#5F6368",
                    fontSize: "14px",
                    fontWeight:
                      selectedModuleTypeID === folder.ModuleTypeID ? 600 : 500,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Notes List */}
      <Grid
        item
        xs={12}
        sm={4}
        md={3}
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          borderRight: "1px solid #E8EAED",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            padding: "20px 24px",
            borderBottom: "1px solid #E8EAED",
            backgroundColor: "#FAFBFC",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#202124",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Description sx={{ color: primaryColor }} />
            {selectedModuleName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#5F6368", fontSize: "12px", mt: 0.5 }}
          >
            {filteredNotes.length} {t("notes")}
          </Typography>
        </Box>

        {/* Scrollable List */}
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#F1F3F4",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#DADCE0",
              borderRadius: "10px",
              "&:hover": {
                background: "#BDC1C6",
              },
            },
          }}
        >
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Fade in key={note.NoteID} timeout={300}>
                <Paper
                  elevation={selectedNote?.NoteID === note.NoteID ? 2 : 0}
                  sx={{
                    mb: 1,
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor:
                      selectedNote?.NoteID === note.NoteID
                        ? primaryColor
                        : "#E8EAED",
                    backgroundColor:
                      selectedNote?.NoteID === note.NoteID
                        ? `${primaryColor}08`
                        : "#fff",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: primaryColor,
                      transform: "translateX(4px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    },
                  }}
                  onClick={() => handleNoteSelect(note)}
                >
                  <Box sx={{ padding: "16px" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#202124",
                        fontSize: "15px",
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {note?.Title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#5F6368",
                        fontSize: "12px",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      {new Date(note?.CreatedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5F6368",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.5,
                      }}
                    >
                      {note.Content.replace(/<[^>]*>/g, "")}
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: 4,
              }}
            >
              <Description sx={{ fontSize: 64, color: "#DADCE0", mb: 2 }} />
              <Typography
                variant="body1"
                sx={{
                  color: "#5F6368",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {t("no_data_found")}
              </Typography>
            </Box>
          )}
        </List>
      </Grid>

      {/* Note Editor */}
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        sx={{
          padding: 0,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {newNoteMode ? (
          <Fade in timeout={300}>
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* Fixed Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: "1px solid #E8EAED",
                  backgroundColor: "#fff",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#202124" }}
                >
                  {t("new_note_button")}
                </Typography>
                <IconButton onClick={() => setNewNoteMode(false)} size="small">
                  <Close />
                </IconButton>
              </Box>

              {/* Scrollable Content */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#F1F3F4",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#DADCE0",
                    borderRadius: "10px",
                    "&:hover": {
                      background: "#BDC1C6",
                    },
                  },
                }}
              >
                <TextField
                  label={t("title")}
                  variant="outlined"
                  fullWidth
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: "#E8EAED",
                      },
                      "&:hover fieldset": {
                        borderColor: primaryColor,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryColor,
                      },
                    },
                  }}
                />

                <Box
                  sx={{
                    mb: 2,
                    "& .quill": {
                      height: "400px",
                    },
                    "& .ql-container": {
                      height: "calc(400px - 42px)",
                      borderRadius: "0 0 12px 12px",
                      border: "1px solid #E8EAED",
                    },
                    "& .ql-toolbar": {
                      borderRadius: "12px 12px 0 0",
                      border: "1px solid #E8EAED",
                      backgroundColor: "#FAFBFC",
                    },
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={newNoteContent}
                    onChange={setNewNoteContent}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                        ["link", "image"],
                        [{ align: [] }],
                        ["clean"],
                      ],
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setNewNoteMode(false)}
                    startIcon={<Close />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      borderColor: "#E8EAED",
                      color: "#5F6368",
                      "&:hover": {
                        borderColor: "#BDC1C6",
                        backgroundColor: "#F8F9FA",
                      },
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAddNote}
                    disabled={!newNoteTitle.trim()}
                    startIcon={<Save />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      backgroundColor: primaryColor,
                      "&:hover": {
                        backgroundColor: primaryColor,
                      },
                    }}
                  >
                    {t("save")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        ) : selectedNote ? (
          <Fade in timeout={300}>
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* Fixed Header */}
              <Box
                sx={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #E8EAED",
                  backgroundColor: "#fff",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#202124",
                        mb: 1,
                        wordBreak: "break-word",
                      }}
                    >
                      {selectedNote.Title}
                    </Typography>
                    {selectedModuleName !== "Personal" && (
                      <Chip
                        label={`Version ${selectedNote?.MasterVersion}`}
                        size="small"
                        sx={{
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor,
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      />
                    )}
                  </Box>
                  <IconButton onClick={() => onClose()} size="small">
                    <Close />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: "12px 16px",
                    backgroundColor: "#FAFBFC",
                    borderRadius: "8px",
                  }}
                >
                  <img src={date} alt="" style={{ width: 20 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "#5F6368", fontWeight: 500 }}
                  >
                    {dateformatter(selectedNote.CreatedDate)}
                  </Typography>
                </Box>
              </Box>

              {/* Scrollable Content */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#F1F3F4",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#DADCE0",
                    borderRadius: "10px",
                    "&:hover": {
                      background: "#BDC1C6",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    "& .quill": {
                      height: "400px",
                    },
                    "& .ql-container": {
                      height: "calc(400px - 42px)",
                      borderRadius: "0 0 12px 12px",
                      border: "1px solid #E8EAED",
                    },
                    "& .ql-toolbar": {
                      borderRadius: "12px 12px 0 0",
                      border: "1px solid #E8EAED",
                      backgroundColor: "#FAFBFC",
                    },
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={editableContent}
                    onChange={setEditableContent}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                        ["link", "image"],
                        [{ align: [] }],
                        ["clean"],
                      ],
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedNote(null)}
                    startIcon={<Close />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      borderColor: "#E8EAED",
                      color: "#5F6368",
                      "&:hover": {
                        borderColor: "#BDC1C6",
                        backgroundColor: "#F8F9FA",
                      },
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleUpdateNote}
                    startIcon={<Update />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      backgroundColor: primaryColor,
                      "&:hover": {
                        backgroundColor: primaryColor,
                      },
                    }}
                  >
                    {t("update_button")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Description sx={{ fontSize: 80, color: "#DADCE0", mb: 3 }} />
            <Typography variant="h6" sx={{ color: "#5F6368", fontWeight: 500 }}>
              {t("select_note_message")}
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default NotesPage;

NotesPage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
NotesPage.defaultProps = {
  onClose: () => {},
};
NotesPage.displayName = "NotesPage";
