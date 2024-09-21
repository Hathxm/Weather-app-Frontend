import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wrapper from './Wrappers/UserWrapper';
import { Provider } from 'react-redux';
import AdminWrapper from './Wrappers/AdminWrapper';
import Store from './Redux/Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route path="/*" element={<Wrapper />} />
          <Route path="admin/*" element={<AdminWrapper />} />
        </Routes>
      </Router>

      {/* ToastContainer to show notifications */}
      <ToastContainer 
        position="top-right"   // You can set different positions like top-left, bottom-right, etc.
        autoClose={5000}       // Automatically close the toast after 5 seconds
        hideProgressBar={false} // Show progress bar for auto-close
        newestOnTop={false}    // Show newest toast on top
        closeOnClick           // Close toast on click
        rtl={false}            // Right to Left
        pauseOnFocusLoss       // Pause toast when window loses focus
        draggable              // Allow dragging to dismiss toasts
        pauseOnHover           // Pause on hover
        theme="light"          // Options: "light", "dark", "colored"
      />
    </Provider>
  );
}

export default App;
