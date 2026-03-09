import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = process.env.REACT_APP_API_URL;

function Home({ userid }) {

  const navigate = useNavigate();

  const [vaults, setVaults] = useState([]);

  const [newVault, setNewVault] = useState({
    websiteName: "",
    username: "",
    email: "",
    password: "",
  });

  const [editVaultId, setEditVaultId] = useState(null);

  const [editVault, setEditVault] = useState({
    websiteName: "",
    username: "",
    email: "",
    password: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [showPassword, setShowPassword] = useState({});

  const { websiteName, username, email, password } = newVault;

  const userId = userid;

  // Load vault entries
  const loadVaults = useCallback(async () => {

    try {
      const res = await axios.get(`${API_URL}/api/vault/${userId}`);
      setVaults(res.data);
    } catch (err) {
      console.error("Error loading vaults:", err);
    }

  }, [userId]);

  // Authentication check
  useEffect(() => {

    if (!userid) {
      navigate("/loginuser", { replace: true });
    } else {
      loadVaults();
    }

  }, [userid, navigate, loadVaults]);

  // Handle new vault input
  const handleChange = (e) => {
    setNewVault({
      ...newVault,
      [e.target.name]: e.target.value
    });
  };

  // Add new vault
  const addVault = async () => {

    if (!websiteName || !username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {

      const res = await axios.post(
        `${API_URL}/api/vault/posting/${userId}`,
        newVault
      );

      setNewVault({
        websiteName: "",
        username: "",
        email: "",
        password: "",
      });

      setVaults([...vaults, res.data]);

    } catch (err) {
      console.error("Error adding vault entry:", err);
    }
  };

  // Start editing vault
  const startEdit = (vault) => {
    setEditVaultId(Number(vault.id));
    setEditVault(vault);
  };

  // Handle edit input
  const handleEditChange = (e) => {
    setEditVault({
      ...editVault,
      [e.target.name]: e.target.value
    });
  };

  // Update vault
  const updateVault = async (vaultId) => {

    if (!editVault.websiteName || !editVault.username || !editVault.email || !editVault.password) {
      alert("Please fill in all fields");
      return;
    }

    try {

      const res = await axios.put(
        `${API_URL}/api/vault/${userId}/${vaultId}`,
        editVault
      );

      setVaults(vaults.map(v => v.id === editVaultId ? res.data : v));

      setEditVaultId(null);

      setEditVault({
        websiteName: "",
        username: "",
        email: "",
        password: "",
      });

    } catch (e) {
      console.error("Error updating vault entry:", e);
    }
  };

  // Delete vault
  const onDelete = async (e) => {

    const vaultId = Number(e.target.value);

    try {

      const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
      if (!confirmDelete) return;

      await axios.delete(`${API_URL}/api/vault/${userId}/${vaultId}`);

      setVaults(vaults.filter(v => v.id !== vaultId));

    } catch (err) {
      console.error("Error deleting vault entry:", err);
    }
  };

  // Toggle password visibility
  const toggleShowPassword = (vaultId) => {

    setShowPassword(prev => ({
      ...prev,
      [vaultId]: !prev[vaultId]
    }));
  };

  // Copy password
  const copyPassword = (password) => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard");
  };

  // Search filtering
  const filteredVaults =
    searchQuery.trim() === ""
      ? vaults
      : vaults.filter(v =>
          v.websiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Sort alphabetically
  const sortedVault = [...filteredVaults].sort((a, b) =>
    a.websiteName.localeCompare(b.websiteName)
  );

  return (

    <div className="home-bg">

      <div className="d-flex justify-content-center mb-3">
        <p>Search:</p>
        <input
          type="text"
          className="form-control ms-3 w-25"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search website..."
        />
      </div>

      <div className="container mt-4">

        <table className="table table-hover border shadow">

          <thead>
            <tr>
              <th>#</th>
              <th>Website/App</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {sortedVault.map((v, i) => (
              <tr key={v.id}>
                <td>{i + 1}</td>

                <td>
                  {editVaultId === v.id ? (
                    <input
                      name="websiteName"
                      value={editVault.websiteName}
                      onChange={handleEditChange}
                      className="btn btn-outline-dark form-control"
                    />
                  ) : (
                    v.websiteName
                  )}
                </td>

                <td>
                  {editVaultId === v.id ? (
                    <input
                      name="username"
                      value={editVault.username}
                      onChange={handleEditChange}
                      className="btn btn-outline-dark form-control"
                    />
                  ) : (
                    v.username
                  )}
                </td>

                <td>
                  {editVaultId === v.id ? (
                    <input
                      name="email"
                      value={editVault.email}
                      onChange={handleEditChange}
                      className="btn btn-outline-dark form-control"
                    />
                  ) : (
                    v.email
                  )}
                </td>

                <td>
                  {editVaultId === v.id ? (
                    <input
                      name="password"
                      value={editVault.password}
                      onChange={handleEditChange}
                      className="btn btn-outline-dark form-control"
                    />
                  ) : (
                    <>
                      {showPassword[v.id] ? v.password : "********"}

                      <button
                        className="btn btn-sm btn-dark m-1"
                        onClick={() => toggleShowPassword(v.id)}
                      >
                        <i className={showPassword[v.id] ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </button>

                      <button
                        className="btn btn-sm btn-dark m-1"
                        onClick={() => copyPassword(v.password)}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </>
                  )}
                </td>

                <td>

                  {editVaultId === v.id ? (
                    <button
                      className="btn btn-success m-1"
                      onClick={() => updateVault(v.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary m-1"
                      onClick={() => startEdit(v)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  )}

                  <button
                    className="btn btn-danger m-1"
                    value={v.id}
                    onClick={onDelete}
                  >
                    <i className="bi bi-trash"></i>
                  </button>

                </td>
              </tr>
            ))}

            {searchQuery === "" && (

              <tr>

                <td>*</td>

                <td>
                  <input
                    name="websiteName"
                    value={newVault.websiteName}
                    onChange={handleChange}
                    className="btn btn-light btn-outline-primary form-control"
                  />
                </td>

                <td>
                  <input
                    name="username"
                    value={newVault.username}
                    onChange={handleChange}
                    className="btn btn-light btn-outline-primary form-control"
                  />
                </td>

                <td>
                  <input
                    name="email"
                    value={newVault.email}
                    onChange={handleChange}
                    className="btn btn-light btn-outline-primary form-control"
                  />
                </td>

                <td>
                  <input
                    name="password"
                    value={newVault.password}
                    onChange={handleChange}
                    className="btn btn-light btn-outline-primary form-control"
                  />
                </td>

                <td>
                  <button className="btn btn-success" onClick={addVault}>
                    Save
                  </button>
                </td>

              </tr>

            )}

          </tbody>
        </table>

        {searchQuery === "" && (
          <p style={{ color: "black" }}>* Add new vault entry</p>
        )}

      </div>
    </div>
  );
}

export default Home;