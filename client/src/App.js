import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './routes/Home';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/sign_in" element={<LoginPage/>} />
          <Route exact path="/sign_up" element={<RegisterPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;