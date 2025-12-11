import { Box, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next';

const SearchBox = () => {
    const { t } = useTranslation();
    return (
        <Box>
            <Box
                padding={"1rem"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    borderRadius: '8px',
                    background: "rgba(255, 255, 255, 1)",
                    borderBottom: "1px solid  rgba(0, 0, 0, 0.12)"
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={t("searchPlaceholderGPT")}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                        '& .MuiInputBase-input': {
                            padding: '0.75rem', // Space inside the input
                        },
                        width: "fit-content",
                        minHeight: "42px",
                        padding: "0",
                    }}
                />
            </Box>
        </Box>
    )
}

export default SearchBox;
