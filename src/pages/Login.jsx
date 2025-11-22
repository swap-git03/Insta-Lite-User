/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/feed";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src="/swapinsta-logo.png" className="auth-logo" alt="logo" />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Login</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
