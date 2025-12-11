import { Box, Button, Modal, Paper, Typography } from '@mui/material';
import timer from "../../../assets/svg/My-Test-Svg/ConfirmModel/timer.svg"
import PropTypes from 'prop-types'

const ConfirmModal = ({ open, handleClose, handleConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper sx={{
        padding: { xs: '1rem', md: '2rem' },
        width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
        margin: 'auto',
        mt: '10%'
      }}>
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: 'center' }}>
          <Box>
            <Typography id="modal-title" variant="h6" component="h2">
            {("confirmTestAttempt")}
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Are you sure you want to take this test?
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              A timer of 30 minutes will begin once you start the test.
            </Typography>
          </Box>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <img src={timer} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography><b>Test Name:</b> Account Opening</Typography>
          <Typography><b>Duration:</b> 30 Minutes</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={handleClose} className='outline-button' sx={{ color: "black", borderColor: "black" }}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirm} sx={{ backgroundColor: "black" }}>Confirm</Button>
        </Box>
      </Paper>
    </Modal>
  );
}

export default ConfirmModal;

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired
};