import  { useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ReactPlayer from "react-player";
import "./VideoPage.css";
import video from "../../../assets/svg/VideoPage/video.svg";
import backButton from "../../../assets/svg/AotuFinance/BackButton.svg";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { GetElementsFolderDocument } from "../../../store/elements/action";
import { BASE_URL } from "../../../config/urlConfig";

const VideoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { elementsDocumentFiles, loading, error } = useSelector(
    (state) => state.elements
  );

  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const { trainingSimulationIDs } = useSelector((state) => state.ids);
  const elementID = useSelector((state) => state.elementid.elementID);
  const storedTrainingSimulationID = presistStore?.TrainingSimulationID;
  const fromActionables = location.state?.fromActionables || false;

  useEffect(() => {
    const TrainingSimulationID = fromActionables
      ? elementID
      : id || storedTrainingSimulationID || trainingSimulationIDs[0];

    if (TrainingSimulationID) {
      const payload = {
        TrainingSimulationID: TrainingSimulationID,
        IsActionable: fromActionables ? true : false,
      };
      dispatch(GetElementsFolderDocument(payload));
    }
  }, [dispatch, id, storedTrainingSimulationID]);

  const handleBack = () => {
    navigate(-1);
  };

  const documentData = elementsDocumentFiles?.data;
  const TrainingSimulationName = documentData?.TrainingSimulationName;
  const VideoFileUrl = documentData?.TrainingSimulationPath;

  const fullVideoUrl = `${BASE_URL}${VideoFileUrl}`;

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <Box className="videoPageContainer" onContextMenu={handleContextMenu}>
      <Box className="videoPageHeader">
        <IconButton onClick={handleBack}>
          <img src={backButton} alt="" />
        </IconButton>
      </Box>
      <Divider sx={{ marginY: 2 }} />
      <Box className="videoPageContent">
        <Box className="videoPageTitle">
          <img src={video} alt="" style={{ marginRight: "1rem" }} />
          <Typography variant="h6" className="videoPageTitleText">
            {TrainingSimulationName}
          </Typography>
        </Box>
        <Divider sx={{ marginY: 2 }} />

        {loading ? (
          <CircularProgress size={40} />
        ) : error ? (
          <Typography variant="body1" color="error">
            Error loading video. Please try again later.
          </Typography>
        ) : fullVideoUrl ? (
          <Box component="div" className="videoPageVideo">
            <ReactPlayer
              url={fullVideoUrl}
              width="100%"
              height="500px"
              controls
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload", 
                  },
                },
              }}
            />
          </Box>
        ) : (
          <Typography variant="body1" color="error">
            Video not available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VideoPage;
