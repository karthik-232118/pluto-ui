import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { useState } from "react";
import Newcategroy from "../../../assets/svg/newdoc/newcategroy.svg";
import "./newdocuments.css";

const NewCategory = () => {
  const [Open, setOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [showExtraField, setShowExtraField] = useState(false);

  const handleChangeDocName = (event) => {
    setDocName(event.target.value);
  };

  const handleChangeDocDescription = (event) => {
    setDocDescription(event.target.value);
  };

  const handleToggleSwitch = () => {
    setShowExtraField((prev) => !prev);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>New Category</Button>
      <Dialog
        open={Open}
        onClose={() => setOpen(false)}
        maxHeight="auto"
        sx={{
          height: "auto",
          display: "flex",
          flexDirection: "column",
          maxHeight: "-webkit-fill-available !importent",
        }}
      >
        <DialogContent>
          <div className="title-wrapper">
            <img src={Newcategroy} alt="newcategroy" />
            <div>
              <Typography variant="h6">New Category</Typography>
              <Typography variant="body1" className="margin-para">
                Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
              </Typography>
            </div>
          </div>
          <Divider
            sx={{
              margin: "1rem 0rem",
            }}
          />
          <div>
            <FormGroup>
              <FormLabel className="label">Category Name</FormLabel>
              <TextField
                className="custom-input-style"
                value={docName}
                onChange={handleChangeDocName}
                fullWidth
                placeholder="Enter Category Name"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel className="label">Category Description </FormLabel>
              <TextField
                className="custom-input-style"
                value={docDescription}
                onChange={handleChangeDocDescription}
                fullWidth
                multiline
                rows={3}
                placeholder="Enter Category Description"
              />
            </FormGroup>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={showExtraField}
                    onChange={handleToggleSwitch}
                  />
                }
              />
              <div>
                <Typography className="label">Category Status</Typography>
                <Typography variant="body1" className="subtitle">
                  Change Category status
                </Typography>
              </div>
              <div className="status-wrapper">
                <Chip label="active" className="status-active" />
              </div>
            </FormGroup>
          </div>
          <div className="actions-wrapper">
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => {
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewCategory;
