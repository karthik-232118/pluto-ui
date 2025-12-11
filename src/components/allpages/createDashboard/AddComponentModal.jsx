import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Zoom,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { useHeadingBgColor } from '../../useHeadingBgColor';
import { useTranslation } from 'react-i18next';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    maxWidth: '800px',
  },
}));



const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  height: 140,
  borderRadius: 10,
  border: '1px solid transparent',
  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #e4e8f0 0%, #f5f7fa 100%) border-box',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  "&:hover": {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box',
    '& $IconWrapper': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    '& $ComponentName': {
      color: theme.palette.primary.main,
    }
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 50,
  height: 50,
  borderRadius: '50%',
  marginBottom: theme.spacing(1.5),
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  fontSize: '28px',
}));

const ComponentName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  textAlign: 'center',
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
}));

const ComponentDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginTop: theme.spacing(0.5),
  opacity: 0.8,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  position: 'relative',
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(0.75, 2.5),
  textTransform: 'none',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.secondary, 0.1),
  }
}));

const DialogSubtitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '0.9rem',
  fontWeight: 400,
  position: 'relative',
  zIndex: 1,
}));

const AddComponentModal = ({ 
  open, 
  onClose, 
  componentTypes, 
  onAddComponent 
}) => {
  const theme = useTheme();
  const bgColor = useHeadingBgColor();
  const {t} = useTranslation();
  const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: bgColor,
  color: 'white',
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
  }
}));

  // Sample descriptions for different component types
  const componentDescriptions = {
    card: t('desc_card'),
    barChart: t('desc_barChart'),
    pieChart: t('desc_pieChart'),
    donutChart: t('desc_donutChart'),
    areaChart: t('desc_areaChart'),
    radarChart: t('desc_radarChart'),
    funnelChart: t('desc_funnelChart'),
    scatterChart: t('desc_scatterChart'),
    table: t('desc_table'),
    gauge: t('desc_gauge'),
    progress: t('desc_progress'),
    statistic: t('desc_statistic'),
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={300}
    >
      <DialogHeader>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" fontWeight="600">
            {t("addDashboardComponent")}
          </Typography>
          <DialogSubtitle>
            {t("selectComponent")}
          </DialogSubtitle>
        </Box>
        <CloseButton onClick={onClose} size="large">
          <CloseIcon />
        </CloseButton>
      </DialogHeader>
      
      <DialogContent sx={{ p: 3, }}>
        <Grid container spacing={2}>
          {componentTypes.map((type) => (
            <Grid item xs={6} sm={4} md={3} key={type.id} sx={{mt:3}}>
              <StyledPaper
                onClick={() => onAddComponent(type)}
                elevation={0}
              >
                <IconWrapper className="IconWrapper">
                  {type.icon || <DashboardCustomizeIcon />}
                </IconWrapper>
                <ComponentName className="ComponentName" variant="body2">
                  {type.name}
                </ComponentName>
                <ComponentDescription>
                  {componentDescriptions[type.id] || t('dataVisualizationComponent')}
                </ComponentDescription>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <CancelButton onClick={onClose}>{t("cancel")}</CancelButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddComponentModal;