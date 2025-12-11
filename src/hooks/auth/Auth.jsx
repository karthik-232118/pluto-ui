import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import notify from "../../assets/svg/utils/toast/Toast";
import { useDispatch } from "react-redux";
import { encryptLoginDataWithSecret } from "../../components/loginMapPath/EncryptAuth";
import { LoginAPI } from "../../store/login/action";

const UseLoginSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValues = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const LoginSubmit = async (data, setErrorMessage) => {
    try {
      const payload = {
        UserName: data?.username,
        Password: data?.password,
      };

      const encres = await encryptLoginDataWithSecret(
        payload,
        "pluto-login-payload"
      );

      const loginEncryptedPayload = {
        p: encres?.encryptedPayload,
        iv: encres?.iv,
      };

      const response = await dispatch(LoginAPI(loginEncryptedPayload));
      console.log("API Response:", response); // Log the response
      localStorage.clear(); // Clear local storage before login
      // Handle response error message
      if (response?.payload?.status === false) {
        const errorMessage = response.payload.message || "Login failed.";
        setErrorMessage(errorMessage);
        notify("error", errorMessage);
        return false;
      }

      // If login is successful
      if (response?.meta?.requestStatus === "fulfilled") {
        const { access_token, userId, user_type } = response.payload;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("user_type", user_type);
        // notify("success", "Login successful! Redirecting to dashboard...");
        navigate("/dashboard");
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An error occurred during login.";
      console.error("Error during login:", error); // Log the error
      setErrorMessage(errorMessage);
      notify("error", errorMessage);
      return false;
    }
  };

  return { register, handleSubmit, setValue, reset, errors, LoginSubmit };
};

export default UseLoginSubmit;
