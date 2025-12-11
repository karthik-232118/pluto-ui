import  { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GetSearchUser } from "../../../../store/usermanagement/action";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const InternalUser = ({ setReceivers }) => {
  const dispatch = useDispatch();
   const { t } = useTranslation();
  const { searchResults, loading, error } = useSelector(
    (state) => state.getalluser
  );
  const [selectedUsers, setSelectedUsers] = useState([]); // Change to an array to handle multiple selections
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Filtered options based on the search query
  const [filteredOptions, setFilteredOptions] = useState([]);

  // Dispatch the search action when the search query changes, but only after 3 characters
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer); // Clear the previous timer
    }

    // Set a new debounce timer
    if (value.length >= 3) {
      const newTimer = setTimeout(() => {
        const payload = { SearchQuery: value };
        dispatch(GetSearchUser(payload)); // Dispatch search action to get users from backend
      }, 500); // 500ms delay before calling the API
      setDebounceTimer(newTimer);
    }
  };

  useEffect(() => {
    dispatch(GetSearchUser({ SearchQuery: '' })); // Initial fetch to get all users
  }, [dispatch]);

  useEffect(() => {
    // Apply local filtering based on the search query
    if (searchQuery.length >= 3) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = searchResults?.data?.filter((user) =>
        (user.UserName || user.UserEmail)
          .toLowerCase()
          .includes(lowerCaseQuery)
      );
      setFilteredOptions(filtered || []);
    } else {
      setFilteredOptions(searchResults?.data || []); // Show all users if query is less than 3 characters
    }
  }, [searchQuery, searchResults]);

  // Ensure options is an array
  const options = Array.isArray(filteredOptions) ? filteredOptions : [];

  // Handle change when users are selected/deselected in the Autocomplete
  const handleChange = (event, newValue) => {
    setSelectedUsers(newValue); // Update the selected users array
    const displaySelectedUsers = newValue.map((user) => ({
      UserName: user.UserName,
      UserEmail: user.UserEmail,
      UserPhoneNumber: user.UserPhoneNumber || '00000000000',
      Markers: []

    }));
    setReceivers(displaySelectedUsers)
  };

  return (
    <div>
      <Autocomplete
        multiple // Enable multi-selection
        value={selectedUsers} // Bind selected users array to Autocomplete
        onChange={handleChange} // Handle user selection/deselection
        options={options || []} // Use the filtered or full search results (or an empty array)
        getOptionLabel={(option) => option?.UserName || option?.UserEmail || ''}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('Select Users')}
            variant="outlined"
            onChange={handleSearchChange} // Attach the search change handler
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params?.InputProps?.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {error && <Typography color="error">{error.message}</Typography>}

      {/* Optionally, display a message if no results are found */}
      {options.length === 0 && searchQuery.length >= 3 && !loading && (
        <Typography>No users found</Typography>
      )}


    </div>
  );
};

export default InternalUser;

InternalUser.propTypes = {
  setReceivers: PropTypes.func.isRequired, // Function to set receivers in the parent component
};  
