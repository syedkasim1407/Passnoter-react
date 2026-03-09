import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function AddUser({ setUserid }) {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[A-Za-z][A-Za-z0-9.]{4,12}@gmail\.com$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid Gmail address.");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }

    try {

      const res = await axios.post(
        `${API_URL}/api/userAuth`,
        user
      );

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("username", res.data.name);

      setUserid(res.data.id);

      navigate("/");

    } catch (err) {
      navigate("/loginuser");
    }
  };

  return (
    <div className="container mt-5">

      <div className="row">

        <div className="col-md-6 offset-md-3 border rounded p-4 shadow">

          <h2 className="text-center mb-4">Sign Up</h2>

          <form onSubmit={onSubmit}>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onInputChange}
            />

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

            <div className="text-center mt-3">

              <button className="btn btn-primary me-2">
                Register
              </button>

              <Link className="btn btn-danger" to="/">
                Cancel
              </Link>

            </div>

          </form>

          <div className="mt-4">

            <h6 className="text-muted">Signup Rules</h6>

            <ul className="small text-muted ps-3">

              <li>All fields are required.</li>
              <li>Email must start with a letter.</li>
              <li>5–13 characters allowed before @gmail.com.</li>
              <li>Valid characters: A–Z, 0–9, and .</li>
              <li>Password must be at least 6 characters long.</li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}