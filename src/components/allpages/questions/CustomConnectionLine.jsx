import { getStraightPath } from '@xyflow/react';
import PropTypes from 'prop-types';
 
function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });
 
  console.log(edgePath)
  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
    </g>
  );
}
 
export default CustomConnectionLine;
CustomConnectionLine.propTypes = {
  fromX: PropTypes.number.isRequired,
  fromY: PropTypes.number.isRequired,
  toX: PropTypes.number.isRequired,
  toY: PropTypes.number.isRequired,
  connectionLineStyle: PropTypes.object.isRequired,
};
CustomConnectionLine.defaultProps = {
  connectionLineStyle: { stroke: '#000', strokeWidth: 2 },
};
