import React from "react";
import "./shape.css"; // Import the SCSS file
// import dubleC from "../../../assets/svg/flowpage/dubleC.svg";
// import squere from "../../../assets/svg/flowpage/node.svg";
import triangle from "../../assets/svg/flowpage/one.svg";
import circle from "../../assets/svg/flowpage/circle.svg";
import dubleC from "../../assets/svg/flowpage/three.svg";
import darkcircle from "../../assets/svg/flowpage/four.svg";
import diamond from "../../assets/svg/flowpage/five.svg";
import roundrectangle from "../../assets/svg/flowpage/node.svg";

import pentagon from "../../assets/svg/flowpage/seven.svg";
// import eight from "../../assets/svg/flowpage/eight.svg";
import Cylinder from "../../assets/svg/flowpage/nine.svg";
// import ten from "../../assets/svg/flowpage/ten.svg";
// import eleven from "../../assets/svg/flowpage/eleven.svg";

import { useDnD } from "./DnDContext";
// Updated image data with the correct imported image paths
const imageData = [
  { id: "diamond", src: diamond },
  { id: "circle", src: circle },
  { id: "cylinder", src: Cylinder },
  { id: "round-rectangle", src: roundrectangle },
  { id: "triangle", src: triangle },
  { id: "pentagon", src: pentagon },
  { id: "darkcircle", src: darkcircle },
  { id: "doubleC", src: dubleC },
];

const Shape = () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/reactflow", nodeType);
  };
  return (
    <div className="shape-container">
      <div className="shape-inner-container">
        {imageData.map((image) => (
          <div
            key={image.id}
            draggable
            onDragStart={(event) => onDragStart(event, image.id)}
            className="shape-item"
          >
            <img src={image.src} alt={image.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shape;
