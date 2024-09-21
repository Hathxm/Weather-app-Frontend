import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../Pages/User/LoginPage/LoginPage';
import SignupComponent from '../Pages/User/Signup/Signup';
import Dashboard from '../Pages/User/Home/UserDashboard';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../axiosinstance/axiosinstance';
import { set_user_basic_details } from '../Redux/UserDetails/UserDetailsSlice';
import UserPrivateRoute from '../PrivateRoutes/UserPrivateRoute';

const UserWrapper = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = localStorage.getItem('access_token');
  const user_basic_details = useSelector((state) => state.user_basic_details);  

  const [isLoading, setIsLoading] = useState(true);  // Add loading state

  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get('user-details', {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const userData = res.data;
      console.log("response is", userData);
      dispatch(
        set_user_basic_details({
          id: userData.id,
          name: userData.username,
          email: userData.email,
          is_superuser: userData.is_superuser,
          is_authenticated: userData.is_active,
        })
      );
      setIsLoading(false);  // Set loading state to false after data is fetched
    } catch (error) {
      console.log(error);
      setIsLoading(false);  // Set loading state to false even if there is an error
    }
  };

  useEffect(() => {
    // localStorage.clear()
    if (token) {
      fetchUserData();  // Fetch user data if token exists
    } else {
      setIsLoading(false);  // No token means no need to wait
    }
  }, [location.pathname, user_basic_details]);

  // Show loading indicator or null while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;  // You can replace this with a better loading UI
  }

  return (
    <Routes>
      <Route path="" element={<Login />} />
      <Route path="signup" element={<SignupComponent />} />
      {/* Only show Dashboard if user is authenticated */}
      <Route path="user-dashboard" element={<UserPrivateRoute><Dashboard /></UserPrivateRoute>} />
    </Routes>
  );
};

export default UserWrapper;
