import { Box, Typography, Modal } from '@mui/material';
import PropTypes from 'prop-types'

const FormDetailModal = ({ open, onClose, log }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h6" component="h2">
          Form Details
        </Typography>
        <Typography sx={{ mt: 2 }}>User: {log.name}</Typography>
        <Typography>Element: {log.elementName}</Typography>
        <Typography>Submitted Date: {log.submittedDate}</Typography>
        <Typography>Due Date: {log.dueDate}</Typography>
      </Box>
    </Modal>
  );
};

export default FormDetailModal;

FormDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  log: PropTypes.shape({
    name: PropTypes.string,
    elementName: PropTypes.string,
    submittedDate: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
};
