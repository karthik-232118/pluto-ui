import {
  Dialog,
} from "@mui/material";
import NotesPage from "./NotesPage";
import PropTypes from "prop-types";

const CustomNotesDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <NotesPage onClose={onClose} />
    </Dialog>
  );
};

export default CustomNotesDialog;

CustomNotesDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
