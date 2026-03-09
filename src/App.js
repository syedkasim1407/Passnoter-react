import './App.css';
import Navbar from './header/Navbar';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from './pages/Home';
import AddUser from './pages/AddUser';
import LoginUser from './pages/LoginUser';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {

  const [userid, setUserid] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    if (userid) {
      localStorage.setItem("userId", userid);
      
    } else {
      localStorage.removeItem("userId");
      
    }
  }, [userid]);

  return (
    <div className="App">
      <Router>
        <Navbar userid={userid} setUserid={setUserid}  />

        <Routes>

          <Route
            path="/"
            element={userid ? <Home userid={userid} /> : <Navigate to="/loginuser" />}
          />

          <Route path="/loginuser" element={<LoginUser setUserid={setUserid} />} />

          <Route path="/adduser" element={<AddUser setUserid={setUserid} />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;