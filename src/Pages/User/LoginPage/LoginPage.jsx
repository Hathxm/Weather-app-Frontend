import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "../../../axiosinstance/axiosinstance";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { set_user_basic_details } from "../../../Redux/UserDetails/UserDetailsSlice";
import { toast } from "react-toastify";
import { Cloud, Zap, Sun, Wind } from "lucide-react"; // Adding Sun and Wind icons

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "username") {
      setUsername(value.trim());
      if (value.trim().length < 4 && value.trim().length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username must be longer than 4 characters",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
      }
    } else if (id === "password") {
      setPassword(value.trim());
      if (value.trim().length < 4 && value.trim().length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be longer than 4 characters",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.username || errors.password) return;

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post("login", loginData);

      if (response.status === 200) {
        const { access, refresh, is_superuser, username, email, id, is_authenticated } = response.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        const userData = {
          id: id,
          name: username,
          is_superuser: is_superuser,
          email: email,
          is_authenticated: is_authenticated,
        };

        toast.success("User Has Logged In");
        dispatch(set_user_basic_details(userData));

        if (is_superuser) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        login: "Invalid username or password",
      }));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await axios.post("google-login", { token });

      if (response.status === 200) {
        const { access, refresh, is_superuser, id, username, email, is_authenticated } = response.data;

        // Store tokens and user details
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        const userData = {
          id: id,
          name: username,
          is_superuser: is_superuser,
          email: email,
          is_authenticated: is_authenticated,
        };

        // Dispatch user details to the store
        dispatch(set_user_basic_details(userData));

        // Navigate based on user role
        if (is_superuser) {
          navigate("/admin/dashboard");
          toast.success("User has successfully logged in");
        } else {
          navigate("/user-dashboard");
          toast.success("User has successfully logged in");
        }
      }
    } catch (error) {
      // Log error details for debugging
      toast.error(error);

      // Check if the error is a 400 response (e.g., email already in use or other issues)
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.error || "Invalid login attempt.";
        toast.error(errorMessage);
      } else {
        // Handle other errors (500 or network-related errors)
        toast.error("An error occurred while logging in. Please try again.");
      }
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      {/* Cloud, Sun, and Wind Icons */}
      <div className="absolute -top-16 flex flex-col items-center justify-center">
        <Cloud className="text-gray-300 w-48 h-32" />
        <Zap className="text-yellow-400 w-10 h-10 animate-pulse" />
      </div>

      {/* Sun and Wind icons will only show on screens wider than `md` */}
      <Sun className="hidden md:block absolute left-24 top-48 w-28 h-28 text-yellow-400 animate-pulse" />
      <Wind className="hidden md:block absolute right-24 top-48 w-28 h-28 text-yellow-400 animate-pulse" />

      {/* Login Form */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 mt-16 mx-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Welcome to WeatherApp</h2>
          <p className="text-gray-500">Sign in to access the latest weather forecasts and insights.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} className="text-gray-500" />
              </div>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!!errors.username || !!errors.password}
          >
            Sign In
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-4 flex justify-center">
          <GoogleOAuthProvider clientId="your-google-client-id">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Google login failed')}
              className="w-full"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
