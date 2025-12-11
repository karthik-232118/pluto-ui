import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { GetUserList } from "../../../store/flow/action";
// import { GetUserList } from "../../../store/flow/action";

const AutoComplateForms = ({
  userList,
  selectedUserIds,
  setSelectedUserIds,
}) => {
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [filteredOptions, setFilteredOptions] = useState(userList); // Initially, all dummy data
  const dispatch = useDispatch();
  // Filter options locally based on the search query
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = userList.filter((user) =>
        `${user.UserFirstName} ${user.UserMiddleName} ${user.UserLastName} ${user.UserEmail}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(userList); // Show all forms if query is less than 3 characters
    }
  }, [searchQuery, userList]);

  // Handle search query change
  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  //   if (e.target.value.length > 3) {
  //     dispatch(
  //       GetUserList({
  //         SearchString: e.target.value,
  //         Limit: 1000,
  //         Page: 1,
  //       })
  //     );
  //   }
  // };

  useEffect(() => {
    if (!userList.length) {
      dispatch(
        GetUserList({
          SearchString: "",
          Limit: 1000,
          Page: 1,
        })
      );
    }
  }, []);
  // Handle selection of users
  const handleChange = (event, newValue) => {
    setSelectedUserIds(newValue.map((user) => user.UserID)); // Store only UserIDs in state
  };

  // Render selected users as readable names
  // const renderSelectedUsers = () => {
  //   return selectedUserIds
  //     .map((userId) => {
  //       const user = userList.find((user) => user.UserID === userId);
  //       if (user) {
  //         return `${user.UserFirstName} ${user.UserMiddleName} ${user.UserLastName} (${user.UserEmail})`;
  //       }
  //       return null;
  //     })
  //     .join(", ");
  // };

  return (
    <div>
      <Autocomplete
        multiple
        value={userList.filter((user) => selectedUserIds.includes(user.UserID))} // Pass the full user objects corresponding to the selected IDs
        onChange={handleChange} // Handle selection change
        options={filteredOptions} // Use filtered options
        getOptionLabel={(option) =>
          `${option.UserFirstName} ${option.UserMiddleName} ${option.UserLastName} (${option.UserEmail})`
        } // Display user names and email
        clearOnEscape={false} // Disable clearing on Escape
        disableClearable // Disable clear button
        fullWidth
        // className="text_input_workflow_select"
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        renderOption={(props, option) => (
          <li {...props}>
            <Checkbox checked={selectedUserIds.includes(option.UserID)} />
            {/* <Typography
              sx={{
                fontSize: "12px",
              }}
                        /> */}
            <Typography variant="caption">
              {`${option.UserFirstName} ${option.UserMiddleName} ${option.UserLastName} (${option.UserEmail})`}
            </Typography>
          </li>
        )}
      />

      {/* Optionally, display a message if no results are found */}
      {filteredOptions.length === 0 && searchQuery.length >= 3 && (
        <Typography>No data found</Typography>
      )}
    </div>
  );
};

export default AutoComplateForms;
