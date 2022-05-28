import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/sign_in" component={LoginPage} />
          <Route exact path="/sign_up" component={RegisterPage} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;