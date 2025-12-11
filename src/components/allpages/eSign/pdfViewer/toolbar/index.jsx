import React from "react";
import "./index.css";
import { IconButton, Menu, MenuItem, Typography, Button } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Toolbar = ({
  numPages,
  active,
  setActive,
  receivers,
  activeReceiver,
  setActiveReceiver,
  isReciverToolbar = true,
  isPagination = true,
}) => {
  const [pageAnchorEl, setPageAnchorEl] = React.useState(null);
  const [receiverAnchorEl, setReceiverAnchorEl] = React.useState(null);
  const {t} = useTranslation();

  const handleNext = () => {
    if (active < numPages) {
      setActive(active + 1);
    }
  };

  const handlePrevious = () => {
    if (active > 1) {
      setActive(active - 1);
    }
  };

  const handlePageMenuClick = (event) => setPageAnchorEl(event.currentTarget);
  const handleReceiverMenuClick = (event) =>
    setReceiverAnchorEl(event.currentTarget);

  const handlePageMenuClose = (page) => {
    setActive(page);
    setPageAnchorEl(null);
  };

  const handleReceiverMenuClose = (receiver) => {
    setActiveReceiver(receiver);
    setReceiverAnchorEl(null);
  };

  return (
    <div
      className="toolbar_toolbar"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {isPagination && (
        <>
          <Typography>Page:</Typography>
          <IconButton onClick={handlePrevious} disabled={active === 1}>
            <ArrowLeftIcon />
          </IconButton>
          <Button onClick={handlePageMenuClick}>{active}</Button>
          <Menu
            anchorEl={pageAnchorEl}
            open={Boolean(pageAnchorEl)}
            onClose={() => setPageAnchorEl(null)}
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <MenuItem key={page} onClick={() => handlePageMenuClose(page)}>
                {page}
              </MenuItem>
            ))}
          </Menu>
          <IconButton onClick={handleNext} disabled={active === numPages}>
            <ArrowRightIcon />
          </IconButton>
        </>
      )}
      {isReciverToolbar && (
        <>
          <Typography>{t("Receiver")}</Typography>
          <Button onClick={handleReceiverMenuClick}>
            {activeReceiver?.UserName || t("Select Receiver")}
          </Button>
          <Menu
            anchorEl={receiverAnchorEl}
            open={Boolean(receiverAnchorEl)}
            onClose={() => setReceiverAnchorEl(null)}
          >
            {receivers.map((receiver) => (
              <MenuItem
                key={receiver.UserEmail}
                onClick={() => handleReceiverMenuClose(receiver)}
              >
                <div>
                  <Typography>{receiver.UserName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {receiver.UserEmail}
                  </Typography>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </div>
  );
};

export default Toolbar;

Toolbar.propTypes = {
  numPages: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired,
  receivers: PropTypes.arrayOf(
    PropTypes.shape({
      UserEmail: PropTypes.string.isRequired,
      UserName: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeReceiver: PropTypes.shape({
    UserEmail: PropTypes.string,
    UserName: PropTypes.string,
  }),
  setActiveReceiver: PropTypes.func.isRequired,
  isReciverToolbar: PropTypes.bool,
  isPagination: PropTypes.bool,
};
Toolbar.defaultProps = {
  activeReceiver: null,
  isReciverToolbar: true,
  isPagination: true,
};

