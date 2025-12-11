import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetCampList } from "../../../store/eSign/action";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const AutocompSearch = ({ setSelectedId }) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const { camplist, loading } = useSelector((state) => state.esing);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [error, setError] = useState(null); // State to manage error messages

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
        const payload = { search: value };
        dispatch(GetCampList(payload)); // Dispatch search action to get users from backend
      }, 500); // 500ms delay before calling the API
      setDebounceTimer(newTimer);
    }
  };

  useEffect(() => {
    // Apply local filtering based on the search query
    if (searchQuery.length >= 3) {
      if (camplist?.campaignList && camplist?.campaignList.length > 0) {
        setFilteredOptions(camplist?.campaignList); // Filter the list if there is a valid search query
      }
    } else {
      setFilteredOptions(camplist?.campaignList || []); // Show all items if query is less than 3 characters
    }
  }, [searchQuery, camplist]);

  useEffect(() => {
    if (
      camplist?.campaignList &&
      camplist?.campaignList.length === 0 &&
      searchQuery.length >= 3
    ) {
      setError({ message: "No results found for your search." });
    } else {
      setError(null); // Reset error if there are results or search query is short
    }
  }, [camplist?.campaignList, searchQuery]);

  // Ensure options is an array
  const options = Array.isArray(filteredOptions) ? filteredOptions : [];

  // Handle change when users are selected/deselected in the Autocomplete
  const handleChange = (event, newValue) => {
    setSelectedId(newValue?.CampaignID || null); // Set selected ID
  };

  return (
    <div>
      <Autocomplete
        onChange={handleChange} // Handle user selection/deselection
        options={options || []} // Use the filtered or full search results (or an empty array)
        getOptionLabel={(option) => option.CampaignName || ""} // Display label
        clearOnEscape={false} // Disable clearing when pressing Escape
        disableClearable // Disable the clear button
        sx={{
          height: "40px",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('select_campaign')}
            sx={{
              width: "200px",
            }}
            variant="outlined"
            onChange={handleSearchChange} // Attach the search change handler
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {error && <Typography color="error">{error.message}</Typography>}

      {/* Optionally, display a message if no results are found */}
      {options.length === 0 && searchQuery.length >= 3 && !loading && (
       <Typography>{t('no_data_found')}</Typography>
      )}
    </div>
  );
};

export default AutocompSearch;

AutocompSearch.propTypes = {
  setSelectedId: PropTypes.func.isRequired, // Function to set the selected ID
};
AutocompSearch.defaultProps = {
  setSelectedId: () => {}, // Default function if not provided
};
