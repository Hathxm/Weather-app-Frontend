import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from '../../../axiosinstance/axiosinstance';
import { ToastContainer, toast } from 'react-toastify';  // Import toast components
import 'react-toastify/dist/ReactToastify.css';           // Import toast CSS

const FormComponentRight = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  // Handle input changes and validation
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') {
      setUsername(value.trim());
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: value.trim().length < 6 && value.trim().length > 0 ? 'Username must be longer than 6 characters' : ''
      }));
    } else if (id === 'email') {
      setEmail(value.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: !emailRegex.test(value.trim()) && value.trim().length > 0 ? 'Invalid email address' : ''
      }));
    } else if (id === 'password') {
      setPassword(value.trim());
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: value.trim().length < 4 && value.trim().length > 0 ? 'Password must be longer than 4 characters' : ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.username || errors.email || errors.password) return;

    try {
      const response = await axios.post('signup', { username, email, password });
      console.log('Signup successful:', response.data);

      // Check if the signup was successful
      if (response.status === 201) {
        toast.success('Account created successfully!', { autoClose: 3000 });
        setTimeout(() => {
          navigate('/login');
        }, 3000);  // Redirect to login page after 3 seconds
      }
    } catch (error) {
      console.error('Signup failed:', error);

      // Display error message as toast
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || 'Signup failed', { autoClose: 3000 });
      } else {
        toast.error('Signup failed', { autoClose: 3000 });
      }
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token)
    try {
      const response = await axios.post("google-login", { token });
      console.log("Received response:", response);

      // If user exists, log them in and navigate to the homepage
      if (response.status === 200) {
        const { email, username, access, refresh } = response.data;
        // localStorage.setItem('email', email);
        // localStorage.setItem('username', username);
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        // dispatch(set_Authentication({
        //   name: username,
        //   isAuthenticated: true,
        //   isAdmin: false,  // Adjust based on your user model
        //   isSuperAdmin: false,  // Adjust based on your user model
        //   isVendor: isVendor,
        // }));

        navigate('home');
      } else {
        // If user is new, proceed with OTP verification
      }
    } catch (error) {
      console.error('Error during Google signup:', error.response || error.message);
    }
  };

  return (
    <section className="h-screen flex items-stretch text-white overflow-hidden bg-gray-500">
      <ToastContainer />  {/* Add ToastContainer to display toasts */}
      <div className="lg:w-1/2 hidden lg:flex items-center justify-center bg-no-repeat bg-cover relative" style={{ backgroundImage: `url('https://i.pinimg.com/564x/f3/45/ae/f345aea3dde25c36d624df7eb61477d1.jpg')` }}>
        <div className="absolute bg-black opacity-50 inset-0 z-0"></div>
        <div className="w-full px-24 z-10 text-center">
          <h1 className="text-5xl font-bold text-white">Welcome to Our Platform</h1>
          <p className="text-3xl my-4 text-white">Join us today and make your event special!</p>
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-gray-800">
        <div className="w-full py-6 z-20">
          <h1 className="text-4xl text-white">Sign Up</h1>
          <p className="text-lg text-white">Create an account and start booking services for your event.</p>
          <form className="sm:w-2/3 w-full px-8 lg:px-10 mx-auto bg-white rounded-lg border-2 border-gray-500 p-8" onSubmit={handleSubmit}>
            <div className="pb-2 pt-4">
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full p-2 text-lg rounded-lg bg-gray-200 border-2 border-transparent focus:outline-none text-black focus:border-blue-600"
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            </div>
            <div className="pb-2 pt-4">
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 text-lg rounded-lg bg-gray-200 border-2 border-transparent focus:outline-none text-black focus:border-blue-600"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="pb-2 pt-4">
              <input
                id="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-2 text-lg rounded-lg bg-gray-200 border-2 border-transparent focus:outline-none text-black focus:border-blue-600"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="px-4 pb-2 pt-4">
              <button
                type="submit"
                className="uppercase w-full p-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={!!errors.username || !!errors.email || !!errors.password}
              >
                Sign Up
              </button>
              <div className='mt-2'>
                <GoogleOAuthProvider clientId="1085163789320-espoks416amh5iin041qm249ngtbe6bk.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Google login failed')}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
          </form>
          <div className="text-center sm:w-2/3 w-full px-8 lg:px-10 mx-auto">
            <p className="mt-4 text-lg text-white">
              Already have an account? <Link to="/login" className="underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormComponentRight;
