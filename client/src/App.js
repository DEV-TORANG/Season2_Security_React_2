import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
          <Routes>
            <Route exact path="/" component={Home} />
            <Route exact path="/" element={Home} />
            <Route exact path="/sign_in" element={Login} />
            <Route exact path="/sign_up" element={Register} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;