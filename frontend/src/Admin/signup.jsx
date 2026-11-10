import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Component.css";


const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const isMatch =
    formData.password &&
    confirmPassword &&
    formData.password === confirmPassword;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMatch) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();


      alert("Signup successful ✅");


      setTimeout(() => {
        navigate("/login");
      }, 1000);

      setMessage("Signup successful ");
      console.log(data);

    } catch (err) {
      console.error("ERROR:", err);
      setMessage("Failed to connect to server ");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join the library system</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


          <div className="input-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phoneNo"
              placeholder="Phone No."
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
          </div>


          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>


          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={isMatch ? "valid" : ""}
              required
            />
            {isMatch && <span className="match">Passwords match</span>}
          </div>


          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>


        {message && <p className="response-msg">{message}</p>}

        <p className="login-text" onClick={() =>
          navigate(`/login`)
        }>
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;