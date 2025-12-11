

import { useSelector } from "react-redux"; // Import useSelector to access Redux store
import "./index.css";
import components from "./components"; // Import static components
import { toast } from "react-toastify";
import Signatories from "./general-components/signatories";

import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Components = ({ activeReceiver }) => {
  const {t} = useTranslation();
  const { getalluser, loading, error } = useSelector((state) => state.getalluser);

  // Filter users with UserSignature
  const usersWithSignature = getalluser?.data?.filter(user => user.UserSiganture);

  return (
    <div  style={{ padding: "10px" }}>
      {/* Heading */}
      <div
        style={{
          fontSize: "16px",
          margin: "20px 0px",
          borderLeft: "3px solid #ffd65b",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
       {t("Select And Drag")}
      </div>

      {/* Draggable Components */}
      <div className="draggable-components" style={{ flexWrap: "wrap", gap: "10px" }}>
        {/* Render Static Components */}
        {components.map((component, index) => (
          <div
            key={index}
            className="drag__component"
            draggable={true}
            onDragStart={(e) => {
              if (activeReceiver.UserEmail === "") {
                toast.error("Please select a receiver");
                return;
              }
              const rect = e.target.getBoundingClientRect();

              const offsetX = e.clientX - rect.x;
              const offsetY = e.clientY - rect.y;
              e.dataTransfer.setData(
                "widgetComponent",
                JSON.stringify({
                  component: component.id,
                  id: component.id, // or some unique identifier
                  offsetX,
                  offsetY,
                })
              );
            }}
            style={{
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f0f0", // Example color, adjust as needed
              borderRadius: "4px",
              position: "relative",
              cursor: "pointer",
              opacity: 1,
              width: "150px",
              height: "48px", // Assuming it's not a small component
              padding: "12px 8px 12px 8px",
              border: "1px dotted #ccc", // Example border color
            }}
          >
            {/* Icon */}
            {(
              <div style={{ marginRight: "8px" }}>
                {component.icon}
              </div>
            )}
            {/* Label */}
            <div style={{ color: "#4F46E5", marginLeft: "8px" }}>
              {component.label}
            </div>
           
          </div>
        ))}

        {/* Render UserSignatures as Draggable Components */}
        {!loading && !error && usersWithSignature && usersWithSignature.length > 0 && (
          usersWithSignature.map((user) => (
            <div
              key={user.UserID}
              className="drag__component user-signature"
              draggable={true}
              onDragStart={(e) => {
                if (activeReceiver.UserEmail === "") {
                  toast.error("Please select a receiver");
                  return;
                }
                const rect = e.target.getBoundingClientRect();

                const offsetX = e.clientX - rect.x;
                const offsetY = e.clientY - rect.y;
                e.dataTransfer.setData(
                  "widgetComponent",
                  JSON.stringify({
                    component: "userSignature",
                    id: user.UserID,
                    signature: user.UserSiganture, // Include signature image URL
                    name: user.UserFirstName, // Include user name
                    offsetX,
                    offsetY,
                  })
                );
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                position: "relative",
                cursor: "pointer",
                opacity: 1,
                width: "150px",
                height: "60px", // Adjust height to accommodate signature image
                padding: "8px",
                border: "1px dotted #ccc",
              }}
            >
              <div style={{ color: "#4F46E5", textAlign: "center" }}>
                {user.UserFirstName}
              </div>
              {/* <img
                src={user.UserSiganture}
                alt={`${user.UserFirstName}'s Signature`}
                style={{ width: "100px", height: "25px", objectFit: "contain" }}
              />
              */}
            </div>
          ))
        )}
      </div>

      {/* Signatories Section */}
      <Signatories />
    </div>
  );
};

export default Components;

Components.propTypes = {
  activeReceiver: PropTypes.shape({
    UserEmail: PropTypes.string.isRequired, // Ensure activeReceiver has a UserEmail property
  }).isRequired, // Mark activeReceiver as required
};

