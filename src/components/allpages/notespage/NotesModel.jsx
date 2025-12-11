import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import dateicon from "../../../assets/svg/notes/date.svg";
import "../../../../src/css/CommonModal.css";
import {
  GetAddNote,
  GetNotesList,
  GetUpdateNote,
} from "../../../store/notes/action";
import { dateformatter } from "../../../utils";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const NotesModel = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [noteContent, setNoteContent] = useState("");
  const [isUpdate, setIsUpdate] = useState(false); // New state to check if update is needed
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;
  const { elementsDocumentFiles } = useSelector((state) => state.elements);
  const notesList = useSelector((state) => state.noteslist.noteslist);
  const heading =
    elementsDocumentFiles?.data?.SOPName ||
    elementsDocumentFiles?.data?.DocumentName ||
    elementsDocumentFiles?.data?.TestSimulationName ||
    elementsDocumentFiles?.data?.TrainingSimulationName ||
    elementsDocumentFiles?.data?.TestMCQName;

  const ModuleTypeID = elementsDocumentFiles?.data?.ModuleTypeID;
  const ModuleID =
    elementsDocumentFiles?.data?.DocumentID ||
    elementsDocumentFiles?.data?.SOPID ||
    elementsDocumentFiles?.data?.TestSimulationID ||
    elementsDocumentFiles?.data?.TrainingSimulationID ||
    elementsDocumentFiles?.data?.TestMCQID;
  const MasterVersion = elementsDocumentFiles?.data?.MasterVersion;
  const ContentID = elementsDocumentFiles?.data?.ContentID;

  // Retrieve note list data
  // Retrieve note list data
  useEffect(() => {
    if (ModuleTypeID && ContentID && ModuleID) {
      const requestBody = {
        ModuleTypeID,
        ContentID,
        ModuleID,
        MasterVersion,
      };

      dispatch(GetNotesList(requestBody))
        .then((response) => {
          // console.log("API Response notes:", response.payload);

          if (response.payload && response.payload.data?.Content) {
            setNoteContent(response.payload.data.Content);
            // console.log(
            //   "response.payload.data.Content:",
            //   response.payload.data.Content
            // );
            setIsUpdate(true); // Set to update mode if content exists
          } else if (
            !response.payload?.data?.Content &&
            response.payload?.data === null
          ) {
            console.log("Notes list is null, setting noteContent to null");
            setNoteContent(null); // Explicitly set to null
          }
        })
        .catch((error) => {
          console.error("Error fetching notes list:", error);
        });
    }
  }, [dispatch, ModuleTypeID, ContentID, ModuleID]);

  const handleAddOrUpdateNote = () => {
    const requestBody = {
      NoteID: notesList?.data?.NoteID || null,
      Content: noteContent,
    };

    if (isUpdate) {
      // Update existing note
      dispatch(GetUpdateNote(requestBody))
        .then((response) => {
          console.log("API Response:", response.payload);
          toast.success("Note updated successfully");
          onClose();
          // window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating note:", error);
        });
    } else {
      // Add new note
      dispatch(
        GetAddNote({
          Title: heading,
          Content: noteContent,
          ModuleTypeID,
          ModuleID,
          MasterVersion,
        })
      )
        .then((response) => {
          console.log("API Response:", response.payload);
          setNoteContent("");
          onClose();
          window.location.reload();
          toast.success("Note added successfully");
        })
        .catch((error) => {
          console.error("Error adding note:", error);
        });
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle
        className="modal-header-gradient"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: bgcolor || "linear-gradient(to top, #2c64ff, #4a90e2)",
        }}
      >
        <span>{heading || "Untitled"}</span>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sx={{ padding: 2, backgroundColor: "#fff" }}>
            <Box>
              <Box sx={{ display: "flex" }}>
                <img src={dateicon} alt="Date icon" />
                <Typography variant="body2" sx={{ mr: 3, marginLeft: "20px" }}>
                  {t("date")}
                </Typography>
                <Typography variant="body2" sx={{ mr: 3, marginLeft: "10px" }}>
                  {dateformatter(notesList?.data?.CreatedDate)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <ReactQuill
                className="custom-quill-editor"
                style={{ minHeight: "100px" }}
                theme="snow"
                value={noteContent}
                onChange={setNoteContent}
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            marginTop: "1rem",
            textTransform: "none",
            marginLeft: "1rem",
            borderColor: "#000",
            color: "#000",
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleAddOrUpdateNote}
          disabled={!heading || !noteContent}
          variant="contained"
          color="primary"
          sx={{
            marginTop: "1rem",
            textTransform: "none",
            marginLeft: "1rem",
          }}
        >
          {isUpdate ? t("Update") : t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesModel;

NotesModel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
