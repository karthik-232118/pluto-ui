


import  { useEffect, useRef } from "react";
import "./index.css";
import { Document, Page, pdfjs } from "react-pdf";
import { getFormComponent } from "../components/components";
import { MarkerColors } from "./colors";
import { CircularProgress, Box } from "@mui/material";
import PropTypes from "prop-types";

const ViewPort = ({
  documentData,
  active,
  receivers,
  setReceivers,
  activeReceiver,
  setActiveReceiver,
  setNumPages,
}) => {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const viewportRef = useRef(null);
  const containerRef = useRef(null);

  // Use offsetX/offsetY from componentData to accurately drop marker
  function GetCoordinates(e, container, offsetX, offsetY) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    return { x, y };
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const removeMarker = (markerId) => {
    const updatedReceivers = receivers.map((receiver) => {
      if (receiver.UserEmail === activeReceiver.UserEmail) {
        return {
          ...receiver,
          Markers: receiver.Markers.filter((marker) => marker.id !== markerId),
        };
      }
      return receiver;
    });

    setReceivers(updatedReceivers);

    setActiveReceiver({
      ...activeReceiver,
      Markers: activeReceiver.Markers.filter(
        (marker) => marker.id !== markerId
      ),
    });
  };

  let allMarkers = receivers
    .map((receiver, index) =>
      receiver.Markers.map((marker) => ({
        ...marker,
        receiverIndex: index,
        receiverName: receiver.UserName,
        receiverEmail: receiver.UserEmail,
      }))
    )
    .flat();

  return (
    <Document
      file={documentData.file}
      onLoadSuccess={onDocumentLoadSuccess}
      className="viewport_viewport"
      inputRef={viewportRef}
      onLoadError={(error) => console.error("Error loading PDF:", error)}
      loading={
        <Box
          sx={{
            width: "617px",
            height: "700px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      }
      style={{
        border: "1px solid black",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const componentData = JSON.parse(
            e.dataTransfer.getData("widgetComponent")
          );

          const { x, y } = GetCoordinates(
            e,
            containerRef.current,
            componentData.offsetX,
            componentData.offsetY
          );

          const pageNumber = active;

          // Check if id exists. If it doesn't, this is a new marker.
          if (componentData.id) {
            // Try to update existing marker if it exists
            let foundMarker = false;
            const updatedReceivers = receivers.map((receiver) => {
              if (receiver.UserEmail === activeReceiver.UserEmail) {
                return {
                  ...receiver,
                  Markers: receiver.Markers.map((marker) => {
                    if (marker.id === componentData.id) {
                      foundMarker = true;
                      return {
                        ...marker,
                        x: x,
                        y: y,
                        pageNumber,
                      };
                    }
                    return marker;
                  }),
                };
              }
              return receiver;
            });

            if (foundMarker) {
              setReceivers(updatedReceivers);
              setActiveReceiver({
                ...activeReceiver,
                Markers: activeReceiver.Markers.map((marker) => {
                  if (marker.id === componentData.id) {
                    return {
                      ...marker,
                      x: x,
                      y: y,
                      pageNumber,
                    };
                  }
                  return marker;
                }),
              });
              return;
            }
            // If foundMarker is false, that means no matching marker was found.
            // This can happen if id was something static. We can treat it as a new marker:
          }

          // If we reach here, create a new marker
          const newMarker = {
            id: activeReceiver.Markers.length + 1,
            component: componentData.component,
            x: x,
            y: y,
            pageNumber,
          };

          if (componentData.component === "userSignature") {
            newMarker.signature = componentData.signature;
            newMarker.name = componentData.name;
          }

          const updatedReceivers = receivers.map((receiver) => {
            if (receiver.UserEmail === activeReceiver.UserEmail) {
              return {
                ...receiver,
                Markers: [...receiver.Markers, newMarker],
              };
            }
            return receiver;
          });

          setReceivers(updatedReceivers);
          setActiveReceiver({
            ...activeReceiver,
            Markers: [...activeReceiver.Markers, newMarker],
          });
        }}
      >
        <Page
          pageNumber={active}
          className="viewport__page"
          renderAnnotationLayer={false}
          renderTextLayer={false}
          customTextRenderer={false}
          width={600} 
        />

        {allMarkers
          .filter((marker) => marker.pageNumber === active)
          .map((marker, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: marker.y,
                left: marker.x,
                zIndex: 20,
              }}
            >
              {getFormComponent(
                marker,
                removeMarker,
                MarkerColors[`_${marker.receiverIndex + 1}`],
                marker.receiverName,
                marker.receiverEmail
              )}
            </div>
          ))}
      </div>
    </Document>
  );
};

export default ViewPort;

ViewPort.propTypes = {
  documentData: PropTypes.shape({
    file: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.number.isRequired,
  receivers: PropTypes.arrayOf(
    PropTypes.shape({
      UserEmail: PropTypes.string.isRequired,
      UserName: PropTypes.string.isRequired,
      Markers: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          component: PropTypes.string.isRequired,
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          pageNumber: PropTypes.number.isRequired,
          signature: PropTypes.string, // Optional for userSignature
          name: PropTypes.string, // Optional for userSignature
        })
      ).isRequired,
    })
  ).isRequired,
  setReceivers: PropTypes.func.isRequired,
  activeReceiver: PropTypes.shape({
    UserEmail: PropTypes.string.isRequired,
    UserName: PropTypes.string.isRequired,
    Markers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        component: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        pageNumber: PropTypes.number.isRequired,
        signature: PropTypes.string, // Optional for userSignature
        name: PropTypes.string, // Optional for userSignature
      })
    ).isRequired,
  }).isRequired,
  setActiveReceiver: PropTypes.func.isRequired,
  setNumPages: PropTypes.func.isRequired,
};
