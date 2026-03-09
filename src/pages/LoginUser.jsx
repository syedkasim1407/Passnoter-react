import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function LoginUser({ setUserid }) {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const { email, password } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {

      const res = await axios.post(
        `${API_URL}/api/login`,
        user
      );

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("username", res.data.name);

      setUserid(res.data.id);

      navigate("/");

    } catch (err) {
      console.error("LOGIN FAILED 👉", err.response?.data);
      alert("Invalid email or password");
    }
  };

  return (

    <div className="container">

      <div className="row">

        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">

          <h2 className="text-center m-4">Login</h2>

          <form onSubmit={onLogin}>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onInputChange}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onInputChange}
            />

            <button className="btn btn-primary mx-2" type="submit">
              Login
            </button>

            <Link className="btn btn-danger mx-2" to="/">
              Cancel
            </Link>

            <Link className="btn btn-primary mx-2" to="/adduser">
              Create Account
            </Link>

          </form>

        </div>

      </div>

    </div>

  );
}