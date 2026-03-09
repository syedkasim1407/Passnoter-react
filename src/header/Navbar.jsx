import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";

export default function Navbar({ userid, setUserid }) {

  const logout = () => {
    localStorage.removeItem("userId");
    setUserid(null);
  };

  const username = localStorage.getItem("username");

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">

        <Link to="/" className="navbar-brand text-white">
          <b>PassNoter</b>
        </Link>

        <div className="d-flex">

          {!userid && (
            <>
              <Link to="/loginuser">
                <button className="btn btn-outline-light m-1">Login</button>
              </Link>

              <Link to="/adduser">
                <button className="btn btn-outline-light m-1">Register</button>
              </Link>
            </>
          )}

          {userid && (
            <button className="btn btn-light ps-7 fs-5">
              <b>{username}</b>
            </button>
          )}

          {userid && (
            <button className="btn btn-danger px-2 ms-3 fs-8" onClick={logout}>
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}