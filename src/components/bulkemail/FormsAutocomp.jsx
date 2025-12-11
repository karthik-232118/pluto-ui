import  { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetFormsList } from "../../store/eSign/action";
import PropTypes from "prop-types";

const FormsAutocomp = ({ setReceivers, setSelecetdForm }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.esing);
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer); 
    }
    if (value.length >= 3) {
      const newTimer = setTimeout(() => {
        const payload = { search: value };
        dispatch(GetFormsList(payload)); 
      }, 500);
      setDebounceTimer(newTimer);
    }
  };

  useEffect(() => {
  
    if (searchQuery.length >= 3) {
      setFilteredOptions(data?.formList || []);
    } else {
      setFilteredOptions(data?.formList || []); 
    }
  }, [searchQuery, data]);

  const options = Array.isArray(filteredOptions) ? filteredOptions : [];
  const handleChange = (event, newValue) => {
    setSelectedUsers(newValue); 
    setReceivers(newValue?.FormData); 
    setSelecetdForm(newValue);
  };

  return (
    <div>
      <Autocomplete
        value={selectedUsers} 
        onChange={handleChange}
        options={options || []} 
        getOptionLabel={(option) => option.FormName || ""} 
        clearOnEscape={false} 
        disableClearable 
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Forms"
            sx={{
              width:"200px"
            }}
            variant="outlined"
            onChange={handleSearchChange} 
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
      {options.length === 0 && searchQuery.length >= 3 && !loading && (
        <Typography>No data found</Typography>
      )}
    </div>
  );
};

export default FormsAutocomp;

FormsAutocomp.propTypes = {
  setReceivers: PropTypes.func.isRequired,
  setSelecetdForm: PropTypes.func.isRequired,
};
