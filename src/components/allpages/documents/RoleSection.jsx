import { Typography, Paper, Stack, Chip, Checkbox } from "@mui/material";
import PropTypes from "prop-types";

const RoleSection = ({
  title,
  roleKey,
  users,
  selectedIds,
  rejectedIds,
  handleSelect,
  getUserColor,
}) => (
  <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "#f9f9f9" }}>
    <Typography variant="subtitle1" fontWeight={600}>
      {title}
    </Typography>
    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
      {users.map((user) => {
        const isSelected = selectedIds.includes(user.UserID);
        const isRejected = rejectedIds.includes(user.UserID);

        // For Reviewers (Checkers): can select/deselect only if ApprovalStatus is null
        const isReviewer = roleKey === "Checkers";
        const canEditReviewer = isReviewer && user.ApprovalStatus === null;

        return (
          <Chip
            key={user.UserID}
            label={
              <Typography
                variant="body2"
                sx={{
                  fontStyle: user.IsDraft ? "italic" : "normal",
                  fontWeight: user.IsDraft ? 500 : "normal",
                  color: getUserColor(user.ApprovalStatus, isSelected),
                }}
              >
                {/* {user?.IsEditable === false ? "🔒 " : ""} */}
                {user.UserName || user.UserID}
              </Typography>
            }
            variant="outlined"
            style={{
              color: getUserColor(user.ApprovalStatus, isSelected),
            }}
            onClick={
              // For Reviewers: only allow select/deselect if ApprovalStatus is null
              isReviewer
                ? user.ApprovalStatus === null
                  ? () => handleSelect(roleKey, user.UserID)
                  : undefined
                : user?.IsEditable === true
                ? () => handleSelect(roleKey, user.UserID)
                : undefined
            }
            icon={
              <Checkbox
                checked={isSelected}
                disabled={
                  isRejected || (isReviewer && user.ApprovalStatus !== null)
                }
                sx={{ p: 0.5 }}
                style={{ color: getUserColor(user.ApprovalStatus, isSelected) }}
              />
            }
          />
        );
      })}
    </Stack>
  </Paper>
);

RoleSection.propTypes = {
  title: PropTypes.string.isRequired,
  roleKey: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  rejectedIds: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  getUserColor: PropTypes.func.isRequired,
};

export default RoleSection;
