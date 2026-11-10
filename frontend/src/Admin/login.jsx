import React, { useState } from "react";
import "./Component.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }


      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("role", data.role);


      if (data.role === "ROLE_ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/booklist");
      }



    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Login to your library account</p>


        <form onSubmit={handleLogin}>

          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot">Forgot password?</span>
          </div>


          {<p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>


        <p
          className="signup-text"
          onClick={() => navigate("/signup")}
        >
          Don't have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;