// try this code in login page

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Login.css";
import UseLoginSubmit from "../../hooks/auth/Auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import img1 from "../../assets/image/LoginPage/img1.jpg";
import img2 from "../../assets/image/LoginPage/img2.jpg";
import img3 from "../../assets/image/LoginPage/img3.jpg";
import user from "../../assets/svg/LoginPage/User.svg";
import lock from "../../assets/svg/LoginPage/Lock.svg";
import loginButton from "../../assets/svg/LoginPage/arrow-right-circle.svg";
import { styled } from "@mui/material";
import { getSSODetailsAPI } from "../../services/SSO/sso";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import logo from "../../assets/svg/logo/logo.svg";
import { validateInput } from "../../utils/securityUtils";

import errorHandler from "../../utils/errorHandler";

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 350, // Ensure font weight is set to 400
  },
});

const Login = () => {
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, LoginSubmit } = UseLoginSubmit();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(
    parseInt(localStorage.getItem("failedAttempts")) || 0
  );
  const [showCaptcha, setShowCaptcha] = useState(
    localStorage.getItem("showCaptcha") === "true"
  );
  const [captchaInput, setCaptchaInput] = useState("");
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  console.log("location", location);
  useEffect(() => {
    if (failedAttempts >= 3) {
      setShowCaptcha(true);

      setTimeout(() => {
        loadCaptchaEnginge(6); // Initialize captcha with 6 characters
      }, 100);
    }
  }, [failedAttempts]);
  console.log("location", location);
  useEffect(() => {
    // Store captcha visibility and failed attempts in localStorage
    localStorage.setItem("failedAttempts", failedAttempts);
    localStorage.setItem("showCaptcha", showCaptcha);
  }, [failedAttempts, showCaptcha]);

  useEffect(() => {
    // Parse the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      console.log("Extracted Token:", token);

      // Check authentication and redirect if needed
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      const publicRoutes = ["/dynamic", "/form"];
      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some((route) =>
        currentPath.startsWith(route)
      );
      if (isAuthenticated && !isPublicRoute) {
        navigate("/dashboard");
        return;
      }

      // Send the token to the API
      const sendTokenToAPI = async () => {
        try {
          const response = await getSSODetailsAPI({ TokenID: token });
          console.log("Token Details API Response:", response?.data?.data);
          if (response?.data?.data) {
            localStorage.setItem(
              "access_token",
              response?.data?.data?.accessToken
            );
            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem(
              "user_id",
              response?.data?.data?.["User.UserID"]
            );
            localStorage.setItem(
              "user_type",
              response?.data?.data?.["User.UserType"]
            );

            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Failed to fetch token details:", error);
        }
      };

      sendTokenToAPI();
    } else {
      console.log("No token found in the URL.");
    }
  }, [navigate]);

  const handleLoginSubmit = async (data) => {
    setErrorMessage("");
    setFormErrors({ username: "", password: "" });
   
    if (!validateInput(data.username)) {
      setFormErrors((prev) => ({
        ...prev,
        username: "Invalid input detected. Please enter a valid username.",
      }));
      errorHandler.addSecurityError(data.username, "username");
      return;
    }

    if (!validateInput(data.password)) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Invalid input detected. Please enter a valid password.",
      }));
      errorHandler.addSecurityError(data.password, "password");
      return;
    }
    setLoading(true);

    const payload = {
      username: data.username,
      password: data.password,
    };

    // Validate Captcha
    if (showCaptcha && !validateCaptcha(captchaInput)) {
      setErrorMessage("Incorrect captcha code.");
      setFailedAttempts((prev) => prev + 1);
      setCaptchaInput(""); // Clear captcha input
      loadCaptchaEnginge(6); // Reload a new captcha
      setLoading(false);
      return;
    }

    try {
      const success = await LoginSubmit(payload, setErrorMessage);
      if (success) {
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("showCaptcha");
        navigate("/dashboard");
      } else {
        setFailedAttempts((prev) => prev + 1);
        if (failedAttempts + 1 >= 3) {
          setShowCaptcha(true);
        }
      }
    } catch (error) {
      console.error("An error occurred during login.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang); // Change the language globally
    localStorage.setItem("selectedLanguage", selectedLang); // Store in localStorage
  };

  // Effect to set the language on initial load
  useEffect(() => {
    i18n?.changeLanguage(language); // Set the initial language from localStorage
  }, [language]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    waitForAnimate: false,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "25px",
          marginRight: "20px",
          height: "2px",
          background:
            i === settings.currentSlide ? "white" : "rgba(255, 255, 255, 0.2)",
        }}
      ></div>
    ),
  };

  const slides = [
    {
      image: img1,
      heading: t("digitizeSOPs"),
      paragraph: t("digitizeSOPsDesc"),
    },
    {
      image: img2,
      heading: t("trainingSimulation"),
      paragraph: t("trainingSimulationDesc"),
    },
    {
      image: img3,
      heading: t("impactAnalysis"),
      paragraph: t("impactAnalysisDesc"),
    },
  ];

  return (
    <div className="root">
      <div
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Typography
          variant="p"
          className="login-heading"
          sx={{
            fontSize: "1.5rem",
            lineHeight: "3rem",
            padding: "0px 10px",
            fontFamily: "Inter",
            fontWeight: 450,
          }}
        >
          {t("appName")}
          {/* <img src={logo} alt="" /> */}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginRight: 2 }}>
          <Tooltip title={t("SelectLanguage")} arrow placement="left">
            <FormControl>
              <Select
                value={language}
                onChange={handleLanguageChange}
                variant="outlined"
                sx={{
                  width: 60,
                  height: 40,
                  marginTop: 0.5,
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "4px",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                }}
                renderValue={(value) => {
                  const selectedLanguage = [
                    { code: "en", countryCode: "US" },
                    { code: "hi", countryCode: "IN" },
                    { code: "ar", countryCode: "AE" },
                    { code: "fr", countryCode: "FR" },
                    { code: "es", countryCode: "ES" },
                    { code: "de", countryCode: "DE" },
                    { code: "pt", countryCode: "PT" },
                    { code: "ms", countryCode: "MY" },
                    { code: "is", countryCode: "IS" },
                    { code: "zh", countryCode: "CN" },
                  ].find((lang) => lang.code === value);
                  return (
                    <ReactCountryFlag
                      countryCode={selectedLanguage.countryCode}
                      svg
                      style={{ fontSize: "13.5px" }}
                    />
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "rgba(255, 255, 255, 0.9)", // Background for dropdown menu
                      "& .MuiMenuItem-root": {
                        padding: "8px 16px", // Adjust padding for menu items
                      },
                    },
                  },
                }}
              >
                <MenuItem value="en">
                  <ReactCountryFlag
                    countryCode="US"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  English
                </MenuItem>
                <MenuItem value="hi">
                  <ReactCountryFlag
                    countryCode="IN"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  हिंदी
                </MenuItem>
                <MenuItem value="ar">
                  <ReactCountryFlag
                    countryCode="AE"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  العربية
                </MenuItem>
                <MenuItem value="fr">
                  <ReactCountryFlag
                    countryCode="FR"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  Français
                </MenuItem>
                <MenuItem value="es">
                  <ReactCountryFlag
                    countryCode="ES"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  Español
                </MenuItem>
                <MenuItem value="de">
                  <ReactCountryFlag
                    countryCode="DE"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  Deutsch
                </MenuItem>
                <MenuItem value="pt">
                  <ReactCountryFlag
                    countryCode="PT"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  Português
                </MenuItem>
                <MenuItem value="ms">
                  <ReactCountryFlag
                    countryCode="MY"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  Melayu
                </MenuItem>
                <MenuItem value="is">
                  <ReactCountryFlag
                    countryCode="IS"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  Íslenska
                </MenuItem>
                <MenuItem value="zh">
                  <ReactCountryFlag
                    countryCode="CN"
                    style={{ marginRight: 8, fontSize: "0.8em" }}
                    svg
                  />
                  中文
                </MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Box>
      </div>
      <div className="content">
        <div className="left-pane">
          <Slider className="slider" {...settings}>
            {slides?.map((slide, index) => (
              <div key={index} className="slider-item">
                <img src={slide.image} alt={`slide-${index}`} />
                <div className="slider-content">
                  <Typography
                    variant="h3"
                    component="h1"
                    className="login-heading"
                    style={{
                      font: "font/family/sans",
                      fontWeight: "600",
                      fontSize: "30px",
                      lineHeight: "36px",
                      letterSpacing: "0.15px",
                      textAlign: "center",
                    }}
                  >
                    {slide.heading}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className="login-para"
                    style={{
                      font: "font/family/sans",
                      fontWeight: "300",
                      fontSize: "20px",
                      lineHeight: "24px",

                      // textAlign: "center",
                    }}
                  >
                    {slide.paragraph}
                  </Typography>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="right-pane">
          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="login-form"
          >
            <Typography
              variant="h4"
              component="p"
              gutterBottom
              sx={{
                // fontFamily: "'P22 Mackinac Pro', serif",
                fontFamily: "Inter",
                fontSize: "40px",
                lineHeight: "49.98px",
                textAlign: "center",
                textUnderlinePosition: "from-font",
                textDecorationSkipInk: "none",
              }}
              className="rightside-heading"
            >
              <img src={logo} alt="" />
            </Typography>

            <CustomTextField
              sx={{ marginTop: "-1rem" }}
              className="text-field"
              variant="outlined"
              placeholder={t("userName")}
              {...register("username")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={user} alt="" />
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: "white",
                  borderRadius: "var(--radiuslg)",
                },
              }}
            />
            {formErrors.username && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 1, textAlign: "left" }}
              >
                {formErrors.username}
              </Typography>
            )}
            <CustomTextField
              className="text-field"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              {...register("password")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={lock} alt="" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: "white",
                  borderRadius: "var(--radiuslg)",
                },
              }}
            />
            {formErrors.password && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 1, textAlign: "left" }}
              >
                {formErrors.password}
              </Typography>
            )}
            {errorMessage && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 1, textAlign: "left" }}
              >
                {errorMessage}
              </Typography>
            )}

            {showCaptcha && (
              <>
                <LoadCanvasTemplate />
                <TextField
                  className="text-field"
                  variant="outlined"
                  placeholder="Enter Captcha Code"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "white",
                      borderRadius: "var(--radiuslg)",
                      fontWeight: "normal",
                    },
                  }}
                />
              </>
            )}
            <Button
              className="login-button"
              variant="contained"
              color="primary"
              endIcon={
                !loading && <img src={loginButton} alt="Login Button Icon" />
              }
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={28}
                  color="inherit"
                  style={{ color: "#fff" }}
                />
              ) : (
                t("login")
              )}
            </Button>
          </form>
          <Typography variant="body2" component="p" className="powered-by">
            {t("poweredBy")}{" "}
            <span
              style={{
                color: "#000",
                fontSize: "20px",
                fontWeight: "550",
                fontFamily: "Inter",
              }}
            >
              {/* {t("appName")} */}
              Zero Zilla
            </span>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;
