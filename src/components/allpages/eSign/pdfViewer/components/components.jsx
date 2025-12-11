

import Signature from "./general-components/signature";
import Stamp from "./general-components/stamp";
import DateComponent from "./general-components/date";
import Initials from "./general-components/initials";
import UserSignature from "./general-components/UserSignature"; // Import UserSignature
import Icons from "./icons";
import CloseIcon from "@mui/icons-material/Close";
import "./index.css"; // Ensure your CSS is correctly imported, if needed

// Define the components array for the draggable items in the sidebar
const components = [
  {
    label: "Signature",
    id: "signature",
    component: <Signature />,
    icon: <Icons type="signature" />,
  },
  {
    label: "Stamp",
    id: "stamp",
    component: <Stamp />,
    icon: <Icons type="stamp" />,
  },
  {
    label: "Date",
    id: "date",
    component: <DateComponent />,
    icon: <Icons type="date" />,
  },
  {
    label: "Initials",
    id: "initials",
    component: <Initials />,
    icon: <Icons type="initials" />,
  },
  // userSignature will be handled dynamically after fetch, but we have a mapping for it below
];

// Map component IDs to actual React components
const componentMap = {
  signature: Signature,
  stamp: Stamp,
  date: DateComponent,
  initials: Initials,
  userSignature: UserSignature, // Add userSignature
};

// For retrieving a component instance based on the id
const getComponent = (id, formData, setFormData, markerData, receiver) => {
  const Component = componentMap[id];
  return (
    <Component
      formData={formData}
      setFormData={setFormData}
      markerData={markerData}
      receiver={receiver}
    />
  );
};

const smallComponents = ["date", "initials"];

// Map for displaying labels on dropped markers
const markerLabelMap = {
  signature: "Signature",
  stamp: "Stamp",
  date: "dd/mm/yyyy",
  initials: "Initials",
  userSignature: "User Signature",
};

// getFormComponent is used in ViewPort to render the dropped markers on the document
const getFormComponent = (marker, removeMarker, color) => {
  // Handle userSignature with a similar style to other components, but showing its image and name
  if (marker.component === "userSignature") {
    return (
      <div
        className="drag__component"
        draggable={true}
        onDragStart={(e) => {
          const rect = e.target.getBoundingClientRect();
          const offsetX = e.clientX - rect.x;
          const offsetY = e.clientY - rect.y;
          e.dataTransfer.setData(
            "widgetComponent",
            JSON.stringify({
              component: marker.component,
              id: marker.id,
              offsetX,
              offsetY,
            })
          );
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: color.bg,
          borderRadius: "4px",
          position: "relative",
          cursor: "pointer",
          opacity: 1,
          width: "150px",
          height: "60px", // Adjust height as needed
          padding: "8px",
          border: `1px dotted ${color.borderColor}`,
        }}
      >
        <UserSignature
          markerData={{
            signature: marker.signature,
            name: marker.name,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            backgroundColor: "red",
            color: "white",
            borderRadius: "100%",
            cursor: "pointer",
            height: "20px",
            width: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            removeMarker(marker.id);
          }}
        >
          <CloseIcon fontSize="small" />
        </div>
      </div>
    );
  }

  // For all other components (signature, stamp, date, initials)
  const height = !smallComponents.includes(marker.component)
    ? "48px"
    : "fit-content";
  const padding = !smallComponents.includes(marker.component)
    ? "12px 8px 12px 8px"
    : "1px 12px";

  return (
    <div
      className="drag__component"
      draggable={true}
      onDragStart={(e) => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.x;
        const offsetY = e.clientY - rect.y;
        e.dataTransfer.setData(
          "widgetComponent",
          JSON.stringify({
            component: marker.component,
            id: marker.id,
            offsetX,
            offsetY,
          })
        );
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color.bg,
        borderRadius: "4px",
        position: "relative",
        cursor: "pointer",
        opacity: 1,
        width: "150px",
        height: height,
        padding: padding,
        border: `1px dotted ${color.borderColor}`,
      }}
    >
      {!smallComponents.includes(marker.component) && (
        <Icons type={marker.component} color={color.color} />
      )}
      <div style={{ color: color.color }}>
        {markerLabelMap[marker.component]}
      </div>
      <div
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          backgroundColor: "red",
          color: "white",
          borderRadius: "100%",
          cursor: "pointer",
          height: "20px",
          width: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          removeMarker(marker.id);
        }}
      >
        <CloseIcon fontSize="small" />
      </div>
    </div>
  );
};

export default components;
export { getComponent, getFormComponent };


