import "./BPMN.css";
import SopsfileIcon from "../../assets/svg/BPMN/SOPsFileIcon.svg";
import documentIcon from "../../assets/svg/SideBar/book-open.svg";
import trainingSimulation from "../../assets/svg/SideBar/video.svg";
import testSimulation from "../../assets/svg/SideBar/monitor.svg";
import testMCQ from "../../assets/svg/SideBar/edit.svg";
import VideoIcon from "../../assets/svg/BPMN/videoIcon.svg";
import { Divider } from "@mui/material";
import { FaEye } from "react-icons/fa";
import PropTypes from "prop-types";


export function ClipsModal({ open, onClose, clips }) {
  if (!open) return null;

  const currentOrigin = window.location.origin;

  const iconMap = {
    sop: SopsfileIcon,
    mcq: testMCQ,
    doc: documentIcon,
    trs: trainingSimulation,
    tes: testSimulation,
    link: VideoIcon,
  };

  const urlMap = {
    sop: "sops/view",
    mcq: "test-mcqs/view",
    doc: "documents/view",
    trs: "training-simulations/view",
    tes: "test-simulations/view",
  };

  return (
    <div className="clips-modal-overlay">
      <div className="clips-modal-content">
        <button className="clips-modal-close-button" onClick={onClose}>
          X
        </button>
        <div style={{fontWeight:"500",marginBottom:"5px"}}> 
          Content
        </div>

      
        <Divider />

        {Array.isArray(clips) && clips.length > 0 ? (
          <ul className="clips-list">
            {clips.map((clip, index) => {
              const type = clip.AttachmentType?.toLowerCase();
              const basePath = urlMap[type] || "sops/view";
              const finalUrl = `${currentOrigin}/${basePath}/${clip.AttachmentLink}?SOP=false`;
              const icon = iconMap[type] || documentIcon;

              return (
                <li key={index} className="clip-item">
                  <img src={icon} alt={clip.AttachmentType} className="clip-icon" />
                  <div className="clip-details" style={{display:"flex", justifyContent:"space-between"}}>
                  <span style={{fontWeight:"350",fontSize:"14px"}}> {clip.AttachmentTitle}</span> <br />
                    <a href={finalUrl} target="_blank" rel="noopener noreferrer">
                    <FaEye/>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No clips found.</p>
        )}
      </div>
    </div>
  );
}

ClipsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clips: PropTypes.arrayOf(
    PropTypes.shape({
      AttachmentType: PropTypes.string,
      AttachmentLink: PropTypes.string,
      AttachmentTitle: PropTypes.string,
    })
  ).isRequired,
};
