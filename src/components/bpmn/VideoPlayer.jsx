import { useLocation } from "react-router-dom";

const VideoPlayer = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoUrl = queryParams.get("url");

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <video controls autoPlay style={{ width: "100%", height: "100%" }}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
