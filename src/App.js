import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wrapper from './Wrappers/UserWrapper';
import { Provider } from 'react-redux';
import AdminWrapper from './Wrappers/AdminWrapper';
import Store from './Redux/Store'

function App() {
  return (
    <Provider store={Store}>
    <Router>
      <Routes>
        <Route path="/*" element={<Wrapper/>} />
        <Route path="admin/*" element={<AdminWrapper />} />

      </Routes>
    </Router>
     </Provider>
  );
}

export default App;
