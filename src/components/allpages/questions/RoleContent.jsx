import  { useEffect, useState } from "react";
import { getroles } from "../../../services/enterprise/Enterprise"; // Adjust the import path
import {
  Checkbox,
  FormControlLabel,
  CircularProgress,
  FormGroup,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { setRolesData } from "../../../store/FlowWithSOP/flowWithSop";
import { useDispatch, useSelector } from "react-redux";

const RoleContent = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.workflow.data.id);
  const allSelectedRoles = useSelector((state) => state.flowWithSop.rolesData);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getroles();
        setRoles(response.data.data.Roles); 
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);
  const handleCheckboxChange = (roleId) => {
    if (allSelectedRoles[id]?.includes(roleId)) {
      dispatch(
        setRolesData({
          id: id,
          value: allSelectedRoles[id].filter((id) => id !== roleId),
        })
      );
      return;
    }
    if (!allSelectedRoles[id]) {
      dispatch(setRolesData({ id: id, value: [roleId] }));
      return;
    }
    dispatch(
      setRolesData({
        id: id,
        value: [...allSelectedRoles[id], roleId],
      })
    );
  };
  const handleRemoveRole = (roleId) => {
    dispatch(
      setRolesData({
        id: id,
        value: allSelectedRoles[id]?.filter((id) => id !== roleId),
      })
    );
  };
  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ width: "90%" }}>
      <Box
        sx={{
          padding: "12px",
          height: "80%",
          overflowY: "auto",
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for WebKit-based browsers (Chrome, Safari, etc.)
        }}
      >
        {allSelectedRoles[id]?.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <div>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: 0,
                }}
              >
                {allSelectedRoles[id]?.map((roleId) => {
                  const role = roles.find((r) => r.RoleID === roleId);
                  return (
                    <Chip
                      key={roleId}
                      label={role?.RoleName}
                      onDelete={() => handleRemoveRole(roleId)}
                      deleteIcon={false} // Remove the icon
                      sx={{
                        marginRight: 1,
                        marginBottom: 1,
                        borderColor: "#9C27B0",
                        color: "#9C27B0",
                        border: "1px solid #9C27B0",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                  );
                })}
              </Box>
            </div>
          </Box>
        )}
        <form >
          <FormGroup>
            {roles?.map((role) => (
              <FormControlLabel
                key={role.RoleID}
                control={
                  <Checkbox
                    checked={allSelectedRoles[id]?.includes(role.RoleID)}
                    onChange={() => handleCheckboxChange(role.RoleID)}
                    name={role.RoleName}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    style={{ fontWeight: 500, marginTop: 8 }}
                    variant="caption"
                  >
                    {role.RoleName}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </form>
      </Box>
    </Box>
  );
};

export default RoleContent;
