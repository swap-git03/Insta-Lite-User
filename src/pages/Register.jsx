/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      setMsg("Registration successful! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err) {
      setMsg("Error while registering");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src="/swapinsta-logo.png" className="auth-logo" alt="logo" />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Register</h2>

          {msg && <p className="info">{msg}</p>}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Register</button>
          </form>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
