import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto login if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      onLogin(true);
    }
  }, [onLogin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const loginUser = () => {
  axios.post("http://localhost:8080/auth/login", form)
    .then(res => {

      // JWT token comes as string
      const token = res.data;

      if(token && token.startsWith("ey")){

        // store token
        localStorage.setItem("token", token);

        // set axios header globally
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        onLogin(token);
      } 
      else {
        setError("Invalid credentials");
      }

    })
    .catch(() => setError("Server error"));
};
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f8"
    }}>
      <div style={{
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        width: "320px"
      }}>
        <h2 style={{ textAlign: "center" }}>College ERP Login</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "10px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "10px" }}
        />

        <button
          onClick={loginUser}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;