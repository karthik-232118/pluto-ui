import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  AvatarGroup,
  Tooltip,
  Divider,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const ViewGroupDetailsModal = ({ open, onClose, group }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  if (!group) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, #f0f0f0)`,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: bgcolor || theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 2,
          pr: 1,
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6">{t("groupDetails")}</Typography>
          <Chip
            label={`${group.UsersInGroup.length} ${t("members")}`}
            size="small"
            sx={{
              ml: 1.5,
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.7rem",
              height: "22px",
            }}
          />
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        <Box
          mb={2}
          sx={{
            backgroundColor:
              theme.palette.mode === "light" ? "#f8f9fa" : "#2d2d2d",
            p: 1.5,
            borderRadius: 2,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
          }}
        >
          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            gutterBottom
          >
            {t("groupName")}
          </Typography>
          <Typography variant="subtitle1" color="primary" fontWeight="450">
            {group.GroupName}
          </Typography>
        </Box>

        <Divider
          sx={{
            my: 1.5,
            borderColor: theme.palette.divider,
            borderBottomWidth: 2,
            borderBottomStyle: "dashed",
          }}
        />

        <Box mb={1.5}>
          <Typography
            variant="subtitle2"
            color="textPrimary"
            gutterBottom
            fontWeight="500"
            sx={{ mb: 1.5, fontSize: "14px" }}
          >
            {t("groupMembers")}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              borderColor: theme.palette.divider,
              background:
                theme.palette.mode === "light" ? "#fcfcfc" : "#1e1e1e",
              boxShadow: theme.shadows[1],
            }}
          >
            <AvatarGroup
              max={6}
              sx={{
                justifyContent: "flex-start",
                mb: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem",
                  borderColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[1],
                },
              }}
            >
              {group.UsersInGroup.map((user, index) => (
                <Tooltip key={index} title={user.UserName}>
                  <Avatar
                    sx={{
                      backgroundColor: getRandomColor(index),
                      fontWeight: "bold",
                    }}
                    alt={user.UserName}
                  >
                    {user.UserName.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>

            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: 5,
                },
                "&::-webkit-scrollbar-track": {
                  background: theme.palette.action.hover,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.primary.main,
                  borderRadius: 2,
                },
              }}
            >
              {group.UsersInGroup.map((user, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                    p: 0.75,
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: "0.75rem",
                      backgroundColor: getRandomColor(index),
                      fontWeight: "bold",
                    }}
                  >
                    {user.UserName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" fontWeight="medium">
                    {user.UserName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to generate consistent random colors based on index
const getRandomColor = (index) => {
  const colors = [
    "#ff6b6b",
    "#48dbfb",
    "#1dd1a1",
    "#feca57",
    "#5f27cd",
    "#ff9ff3",
    "#00d2d3",
    "#ff9f43",
    "#54a0ff",
    "#ee5253",
  ];
  return colors[index % colors.length];
};

export default ViewGroupDetailsModal;

ViewGroupDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  group: PropTypes.shape({
    GroupName: PropTypes.string.isRequired,
    UsersInGroup: PropTypes.arrayOf(
      PropTypes.shape({
        UserID: PropTypes.string.isRequired,
        UserName: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
};
ViewGroupDetailsModal.defaultProps = {
  group: null,
};
ViewGroupDetailsModal.displayName = "ViewGroupDetailsModal";
