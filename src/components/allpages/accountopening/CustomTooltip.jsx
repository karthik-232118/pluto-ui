// CustomTooltip.js
import { Tooltip, styled } from '@mui/material';
import PropTypes from 'prop-types';

const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.common.white,
    color: 'black',
    boxShadow: theme.shadows[1],
    fontSize: 12,
    // border: '1px solid #dadde9',
    width: '74px',
    height: '40px',
    gap: '0px',
    borderRadius: '8px 0px 0px 0px',
    opacity: 0,
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.common.white,
  },
}));

const CustomTooltip = ({ title, placement = 'left', children, ...props }) => {
  return (
    <WhiteTooltip
      title={<p>{title}</p>}
      placement={placement}
      arrow
      {...props}
    >
      {children}
    </WhiteTooltip>
  );
};

export default CustomTooltip;

CustomTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  children: PropTypes.node.isRequired,
};
