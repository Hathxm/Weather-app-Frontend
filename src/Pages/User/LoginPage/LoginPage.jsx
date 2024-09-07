// Login.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "../../../axiosinstance/axiosinstance";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { set_user_basic_details } from "../../../Redux/UserDetails/UserDetailsSlice";
import { useDispatch } from 'react-redux';


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

    // Prevent submission if there are errors
    if (errors.username || errors.password) return;

    const loginData = {
      username: username,
      password: password,
    };

    try {
      // Send login data to the API
      const response = await axios.post("login", loginData);

      // Handle successful login
      if (response.status === 200) {
        const { access, refresh, is_superuser, username, email, id, is_authenticated } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        const userData = {
          id: id,
          name: username,
          is_superuser: is_superuser,
          email: email,
          is_authenticated: is_authenticated,
        };
        
        console.log('User Data:', userData); // Log the data being dispatched to Redux

        // Dispatch the user details to Redux
        dispatch(set_user_basic_details(userData));

        // Redirect based on user role
        if (is_superuser) {
          navigate('/admin/dashboard');  // Navigate to Admin Dashboard
        } else {
          navigate('/user-dashboard');  // Navigate to User Dashboard
        }
      }
    } catch (error) {
      console.error('Error during login:', error.response || error.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        login: "Invalid username or password",
      }));
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token);
    try {
      const response = await axios.post("google-login", { token });
      console.log("Received response:", response);

      // If user exists, log them in and navigate to the homepage
      if (response.status === 200) {
        const { access, refresh, is_superuser, id, username, email, is_authenticated } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        const userData = {
          id: id,
          name: username,
          is_superuser: is_superuser,
          email: email,
          is_authenticated:is_authenticated,
        };

        console.log('User Data:', userData); // Log the data being dispatched to Redux

        // Dispatch the user details to Redux
        dispatch(set_user_basic_details(userData));

        if (is_superuser) {
          navigate('/admin/dashboard');  // Navigate to Admin Dashboard
        } else {
          navigate('/user-dashboard');  // Navigate to User Dashboard
        }
        
      } else {
        // If user is new, proceed with OTP verification
      }
    } catch (error) {
      console.error('Error during Google signup:', error.response || error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="mx-4 w-full max-w-md bg-white shadow-md rounded-lg">
        <div className="p-6 text-center space-y-2">
          <h2 className="text-3xl font-bold">Welcome to WeatherApp</h2>
          <p className="text-gray-500">
            Sign in to access the latest weather forecasts and insights.
          </p>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
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
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
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
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!!errors.username || !!errors.password}
          >
            Sign In
          </button>
        </form>
        {/* Google login section */}
        <div className="px-6 py-4 flex justify-center">
          <GoogleOAuthProvider clientId="1085163789320-espoks416amh5iin041qm249ngtbe6bk.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Google login failed')}
              className="w-full"
            />
          </GoogleOAuthProvider>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
