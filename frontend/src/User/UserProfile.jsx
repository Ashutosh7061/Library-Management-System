import React, { useState, useEffect } from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080/api/v1/user";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [profileTransaction, setProfileTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });


  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
    memberId: "Loading",
    role: "User"
  });

  const [formData, setFormData] = useState({
    name: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.warn("No JWT token found, redirecting...");
      navigate("/", { replace: true });
      return;
    }

    try {
      const decodedData = jwtDecode(token);
      const loadedUser = {
        name: decodedData.name || "Unknown User",
        email: decodedData.sub || decodedData.email || "",
        memberId: decodedData.userId || decodedData.id || "",
        role: decodedData.role || "User"
      };

      setUser(loadedUser);
      setFormData({ name: loadedUser.name });
    } catch (error) {
      console.error("Invalid token format:", error);
      showPopup("Session error. Please log in again.", "error");
      localStorage.removeItem("jwt");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const jwtToken = localStorage.getItem("jwt");
        if (!jwtToken) {
          console.error("No JWT found in local storage");
          return;
        }

        let url = `${BASE_URL}/transaction`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setProfileTransaction(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setProfileTransaction([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


  const totalIssuedCount = profileTransaction.length;
  const borrowedCount = profileTransaction.filter((tx) => tx.status === "ISSUED").length;
  const returnedCount = profileTransaction.filter((tx) => tx.status === "RETURNED").length;

  const showPopup = (message, type = "success") => {
    setPopup({
      show: true,
      type: type,
      message: message,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setFormData({ name: user.name });
    setEditing(!editing);
  };

  const handleSave = () => {
    setUser({ ...user, name: formData.name });
    setEditing(false);
    showPopup("Profile updated successfully", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const getInitials = (name) => {
    if (!name || name === "Loading...") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="lrp-container">
      <div className="lrp-welcome">
        <h1>Welcome Back, {user.name}</h1>
        <p>
          Manage your library profile, monitor issued books,
          review your activity, and keep your account information
          updated through your personalized dashboard.
        </p>
      </div>


      <div className="lrp-topbar">
        <h2>My Profile</h2>
        <button className="lrp-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>


      <div className="lrp-profile-header">
        <div className="lrp-avatar">
          {getInitials(user.name)}
        </div>

        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="lrp-role">{user.role}</span>
        </div>
      </div>


      <div className="lrp-grid">

        <div className="lrp-card">
          <h3>Account Information</h3>

          <label>Name</label>
          <input
            name="name"
            value={editing ? formData.name : user.name}
            onChange={handleChange}
            disabled={!editing}
          />

          <label>Email</label>
          <input
            name="email"
            value={user.email}
            disabled
          />

          <label>Member ID</label>
          <input value={user.memberId} disabled />

          <div className="lrp-btn-group">
            <button className="lp-edit-btn" onClick={handleEditToggle}>
              {editing ? "Cancel" : "Edit Profile"}
            </button>

            {editing && (
              <button className="lp-save-btn" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        </div>


        <div className="lrp-card">
          <h3>Library Stats</h3>
          <div className="lrp-stats">
            <div>
              <h4>{totalIssuedCount}</h4>
              <p>Total Actions</p>
            </div>
            <div>
              <h4>{borrowedCount}</h4>
              <p>Borrowed</p>
            </div>
            <div>
              <h4>{returnedCount}</h4>
              <p>Returned</p>
            </div>
            <div>
              <h4>Jan 2023</h4>
              <p>Member Since</p>
            </div>
          </div>
        </div>
      </div>


      <div className="lrp-card">
        <h3>Recent Activity</h3>
        <ul className="lrp-activity">
          {loading ? (
            <li>Loading transaction history...</li>
          ) : profileTransaction.length === 0 ? (
            <li>No recent transactions found.</li>
          ) : (
            profileTransaction.slice(0, 5).map((tx, index) => (
              <div key={tx.transactionId || index}>
                <li>
                  <strong>{tx.status}</strong> — "{tx.bookTitle || "Unknown Book"}"
                  {tx.issueDate && <span className="lrp-date-sub"> ({tx.issueDate})</span>}
                </li>
              </div>
            ))
          )}
        </ul>
      </div>


      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>
            <div className="popup-icon">
              {popup.type === "success" ? "✓" : "!"}
            </div>

            <div className="popup-content">
              <h4>{popup.type === "success" ? "Success" : "Error"}</h4>
              <p>{popup.message}</p>
            </div>

            <button
              className="popup-close"
              onClick={() =>
                setPopup({
                  show: false,
                  type: "success",
                  message: "",
                })
              }
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;