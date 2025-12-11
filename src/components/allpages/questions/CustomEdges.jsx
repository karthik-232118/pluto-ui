import { useStore, BaseEdge, getBezierPath } from "@xyflow/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropTypes from "prop-types";

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY },
  offset
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};
const getSteppedPath = ({ sourceX, sourceY, targetX, targetY }) => {
  const centerX = (sourceX + targetX) / 2;
  return `M${sourceX},${sourceY} H${centerX} V${targetY} H${targetX}`;
};
const CustomConnectionLine = ({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  const isBiDirectionEdge = useStore((state) => {
    const edgeExists = state.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target)
    );
    return edgeExists;
  });

  // Step 4: Define edge path parameters
  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };
  let path = "";
  if (isBiDirectionEdge) {
    [path] = getBezierPath(edgePathParams);
  } else {
    path = getSteppedPath(edgePathParams);
  }
  return (
    <BaseEdge path={path}>
      {isBiDirectionEdge && (
        <>
          <foreignObject
            x={sourceX - 20}
            y={sourceY - 10}
            width={20}
            height={20}
          >
            <ArrowBackIcon style={{ fontSize: 20, color: "black" }} />
          </foreignObject>
          <foreignObject
            x={targetX - 20}
            y={targetY - 10}
            width={20}
            height={20}
          >
            <ArrowForwardIcon style={{ fontSize: 20, color: "black" }} />
          </foreignObject>
        </>
      )}
    </BaseEdge>
  );
};

export default CustomConnectionLine;

CustomConnectionLine.propTypes = {
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  targetPosition: PropTypes.string.isRequired,
};
