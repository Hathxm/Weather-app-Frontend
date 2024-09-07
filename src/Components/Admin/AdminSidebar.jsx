import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/UserDetailsSlice';

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear(); 
    dispatch(
        set_user_basic_details({
            id : null,
            name: null,
            email:null,
            is_superuser:false,
            is_authenticated:false,
        })
    ) // Clear the local storage (logout)
    navigate("/login");    // Redirect to the login page
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const navLinkClasses = ({ isActive }) =>
    isActive ? "block p-4 bg-gray-700 text-white" : "block p-4 hover:bg-gray-700 text-gray-300";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-64'}`}
      >
        {/* Admin Panel title */}
        <div className="flex justify-between items-center p-4 text-2xl font-bold transition-opacity duration-300">
          <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            Admin Panel
          </span>
          {/* Toggle button when sidebar is open */}
          {isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="text-white p-2 rounded-full shadow-lg"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
        </div>

        <nav className="flex-grow">
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={navLinkClasses}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/user-management" className={navLinkClasses}>
                Users
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="block w-full text-left p-4 hover:bg-gray-700 text-gray-300">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-grow ml-${isSidebarOpen ? '64' : ''} transition-all duration-300`}>
        {/* Toggle button when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-0 left-4 text-white p-2 rounded-full shadow-lg"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}

        {children}
      </main>
    </div>
  );
};

export default Sidebar;
