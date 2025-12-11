import  { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import RightSidebar from '../rightsidebar/RightSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { GetElementsFolderDocument } from '../../../store/elements/action';
import PropTypes from 'prop-types';

const CommonContainer = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const { elementsdocumentfiles } = useSelector((state) => state.elements);
  const presistStore = useSelector((state) => state.sidebarstate !== undefined ? state.sidebarstate : {});
  const elementId = presistStore.elementId;
  useEffect(() => {
    if (elementId) {
      dispatch(GetElementsFolderDocument({ elementId: elementId })); 
    }
  }, [dispatch, elementId]);
  useEffect(() => {
    // console.log("Fetched document files:", elementsdocumentfiles);
  }, [elementsdocumentfiles]);
  const handleSidebarToggle = (openState) => {
    setIsSidebarOpen(openState);
  };

  return (
    <Box sx={{  
     background: (theme) => { theme.palette.background.paper },
     minHeight: '100vh', overflowX: 'hidden', display: 'flex' }}>
      <Grid
        sx={{
          flexGrow: 1,
          marginTop: '0.6rem',
          transition: 'margin-right 0.3s',
          marginRight: isSidebarOpen ? '290px' : '50px', // Adjust based on sidebar state
        }}
      >
        {children}
      </Grid>
      
      <RightSidebar onToggle={handleSidebarToggle} 
       />
    </Box>
  );
};

export default CommonContainer;


CommonContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
CommonContainer.defaultProps = {
  children: null,
};




