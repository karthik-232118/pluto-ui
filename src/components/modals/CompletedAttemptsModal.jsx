import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // For the close button icon
import PropTypes from 'prop-types';

const CompletedAttemptsModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="completed-modal-title"
      aria-describedby="completed-modal-description"
    >
      <Box
        sx={{
            position: 'relative',
            width: 400,
            margin: 'auto',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #FBB7CE 10%, #B5FFFC 90%)', // Light gradient background
            padding: 4,
            borderRadius: '12px',
            boxShadow: 24,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="completed-modal-title" variant="h6" component="h2"
         sx={{
            fontFamily: 'Besen, sans-serif', // Make sure "Besen" font is loaded in your project
            color: 'drakGray', // Text color matching background
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Attempts Completed
        </Typography>
        <Typography id="completed-modal-description" 
         sx={{
            mt: 2,
            fontFamily: 'Besen, sans-serif',
            color: '#000',
            textAlign: 'center',
            fontWeight: 500,
          }}
          >
          Your attempts for this test have been <span style={{color:"red"}}>completed.</span>
        </Typography>
      </Box>
    </Modal>
  );
};

export default CompletedAttemptsModal;

CompletedAttemptsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
CompletedAttemptsModal.defaultProps = {
  open: false,
  handleClose: () => {},
};
