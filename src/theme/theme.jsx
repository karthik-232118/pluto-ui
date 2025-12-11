import { createTheme } from "@mui/material/styles";
import colors from "./color.json"; // Assuming colors is imported correctly

const createAppTheme = (isDarkMode) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#2566e8", // Light blue for primary
      },
      secondary: {
        main: "#f48fb1", // Light pink for secondary
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff",
        paper: isDarkMode ? "#121212" : "#F2F4FE",
      },
      text: {
        primary: isDarkMode ? colors.white : colors.black,
      },
      border: {
        main: colors.white, // Assuming colors.white exists in color.json
      },
      error: {
        main: colors.error, // Assuming colors.error exists in color.json
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            height: "44px",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid",
            boxShadow: "0px 1px 2px 0px #1018280D",
            fontFamily: ["Inter"].join(","),
            fontSize: "16px",
          },
          outlined: {
            height: "44px",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid",
            boxShadow: "0px 1px 2px 0px #1018280D",
            color: "#000",
            fontFamily: ["Inter"].join(","),
            fontSize: "16px",
          },
        },
        defaultProps: {
          disableRipple: true,
        },
      },
    },
    typography: {
      fontFamily: ["Inter"].join(","),
      poster: {
        fontFamily: "var(--font-family)",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
        letterSpacing: "0.1em",
      },
      subtitle1: {
        fontFamily: "var(--font-family)",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
        letterSpacing: "0.1em",
        marginBottom: "0.2rem",
      },
      subtitle2: {
        fontFamily: "var(--font-family)",
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "24px",
        letterSpacing: "0.1em",
      },
      h1: {
        color: "#000",
        fontFamily: "var(--font-family)",
        fontSize: "64px",
        fontWeight: "700",
        lineHeight: "144px",
      },
      h2: {
        color: colors.primary, // Assuming you define this in color.json
        fontFamily: "var(--font-family)",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "normal",
      },
      h3: {
        fontFamily: "var(--font-family)",
        fontSize: "36px",
        fontWeight: "800",
        lineHeight: "54px",
      },
      h6: {
        fontFamily: "Inter",
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "28px",
        textAlign: "left",
        textUnderlinePosition: "from-font",
        textDecorationSkipInk: "none",
      },
      body1: {
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "29.06px",
        letterSpacing: "-0.02em",
        textTransform: "capitalize",
        color: isDarkMode ? colors.white : colors.gray, // Dynamic text color
      },
      caption: {
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "29.06px !important",
        letterSpacing: "-0.02em",
        textAlign: "left",
        textTransform: "capitalize",
      },
    },
  });
};

export default createAppTheme;
