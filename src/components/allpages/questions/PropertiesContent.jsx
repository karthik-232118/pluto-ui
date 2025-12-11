// PropertiesContent.js
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const PropertiesContent = ({
  newLabel,
  setNewLabel,
  newColor,
  setNewColor,
  selectedNode,
  handleAddClip,
  handleDeleteClip,
  handleAddImage,
  handleDeleteImage,
  handleSave,
  properties
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          zIndex: 1,
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          height: '54px',
        }}
      >
        <Box
          component="img"
          src={properties}
          alt="Roles Icon"
          sx={{ marginRight: '10px' }}
        />
        <span style={{ fontWeight: '450', fontSize: '15px' }}>Properties</span>
      </Typography>

      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            width: 300,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: '#f9f9f9',
            height: '100%',
          }}
        >
          <TextField
            fullWidth
            label="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            variant="outlined"
          />
          <TextField
            fullWidth
            type="color"
            label="Background Color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            variant="outlined"
          />
          <Grid container spacing={2}>
            <Grid item xs={10}>
              {selectedNode && (
                <Button
                  variant="contained"
                  onClick={handleAddClip}
                  sx={{
                    textTransform: 'none',
                    color: '#fff',
                    backgroundColor: '#000',
                    width: '240px',
                  }}
                >
                  Add Clip
                </Button>
              )}
            </Grid>
            <Grid item xs={4}>
              <Delete
                sx={{
                  color: 'red',
                  marginTop: '6px',
                  marginLeft: '8px',
                }}
                onClick={handleDeleteClip}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Button
                variant="contained"
                onClick={handleAddImage}
                sx={{
                  textTransform: 'none',
                  color: '#fff',
                  backgroundColor: '#000',
                  width: '240px',
                }}
              >
                Add Image
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Delete
                sx={{
                  color: 'red',
                  marginTop: '6px',
                  marginLeft: '8px',
                }}
                onClick={handleDeleteImage}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              textTransform: 'none',
              alignSelf: 'center',
              width: '100%',
              paddingY: 1,
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertiesContent;



PropertiesContent.propTypes = {
  newLabel: PropTypes.string.isRequired,
  setNewLabel: PropTypes.func.isRequired,
  newColor: PropTypes.string.isRequired,
  setNewColor: PropTypes.func.isRequired,
  selectedNode: PropTypes.object,
  handleAddClip: PropTypes.func.isRequired,
  handleDeleteClip: PropTypes.func.isRequired,
  handleAddImage: PropTypes.func.isRequired,
  handleDeleteImage: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  properties: PropTypes.string.isRequired
};
