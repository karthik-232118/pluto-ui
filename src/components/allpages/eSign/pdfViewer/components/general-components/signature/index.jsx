import  { useRef, useState } from "react";
import "./index.css";
import {
  Button,
  Modal,
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import { toPng } from "html-to-image";
import PropTypes from "prop-types";

const Signature = ({ formData, setFormData, markerData, receiver }) => {
  console.log({ receiver, formData, markerData }, "Signature");
  const [signatureTabOpen, setSignatureTabOpen] = useState(false);
  const sigCanvas = useRef({});
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onSignatureImageChoose = (e) => {
    console.log(e.target.files[0]);
    // convert to data url

    const files = e.target.files;
    const file = files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        console.log("reader", reader.result);
        formData[markerData.markerId] = {
          markerId: markerData.markerId,
          markerType: "image",
          data: reader.result,
        };
        setFormData(formData);
        handleCloseSignatureTab();
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }

    setFormData(formData);
  };

  const save = () => {
    formData[markerData.markerId] = {
      markerId: markerData.markerId,
      markerType: "image",
      data: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
    };
    setFormData(formData);
    handleCloseSignatureTab();
  };

  const clear = () => sigCanvas.current.clear();

  const handleOpenSignatureTab = () => {
    setSignatureTabOpen(true);
  };
  const handleCloseSignatureTab = () => {
    setSignatureTabOpen(false);
  };

  const htmlToImageConvert = async (id) => {
    const ele = document.getElementById(id);
    const url = await toPng(ele);
    console.log("url", url);
    return url;
  };

  const data = formData[markerData?.markerId]?.data;

  return (
    <>
      <Box
        className="signature"
        onClick={handleOpenSignatureTab}
        sx={{
          cursor: "pointer",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {data ? (
          <img
            src={data}
            alt="signature"
            style={{
              objectFit: "contain",
              height: "50px",
              width: "150px",
            }}
          />
        ) : (
          <Typography variant="body2">Click to sign</Typography>
        )}
      </Box>

      <Modal open={signatureTabOpen} onClose={handleCloseSignatureTab}>
        <Box
          className="signature__modal"
          sx={{
            width: "90%",
            maxWidth: 600,
            margin: "auto",
            mt: 5,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" mb={2} align="center">
            Modal Heading
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="signature tabs"
            centered
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Styles" />
            <Tab label="Draw" />
            <Tab label="Choose" />
          </Tabs>

          {activeTab === 0 && (
            <Box
              className="signature__styles"
              sx={{ mt: 2, textAlign: "center" }}
            >
              {[
                "LeagueScript-Regular",
                "Qwigley-Regular",
                "Andina-Regular",
              ].map((font) => (
                <Typography
                  key={font}
                  id={`${font}`}
                  className="signature__font"
                  onClick={async () => {
                    formData[markerData.markerId] = {
                      markerId: markerData.markerId,
                      markerType: "image",
                      data: await htmlToImageConvert(font),
                      height: 50,
                      width: 200,
                    };
                    setFormData(formData);
                    handleCloseSignatureTab();
                  }}
                  sx={{
                    fontFamily: font,
                    fontSize: "30px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    px: 2,
                    lineHeight: "5rem",
                    borderRadius: "55px",
                    display: "inline-block",
                    marginX: 1,
                  }}
                >
                  {receiver?.UserName}
                </Typography>
              ))}
            </Box>
          )}

          {activeTab === 1 && (
            <Box
              className="signature-wrapper"
              sx={{ mt: 2, textAlign: "center" }}
            >
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "sigCanvas",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button onClick={save} variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={clear} variant="outlined" color="secondary">
                  Clear
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography>Choose your signature</Typography>
              <TextField
                type="file"
                fullWidth
                inputProps={{ accept: "image/*" }}
                onChange={onSignatureImageChoose}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Signature;

Signature.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  markerData: PropTypes.object.isRequired,
  receiver: PropTypes.object.isRequired,
};

