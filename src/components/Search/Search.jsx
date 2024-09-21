/* eslint-disable react/prop-types */
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch }) {
  return (
    <TextField
      variant="outlined"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Buscar..."
      size="small" 
      sx={{
        width: '200px',
        backgroundColor: 'white', 
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ccc', 
          },
          '&:hover fieldset': {
            borderColor: '#999', 
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3f51b5', 
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBar;