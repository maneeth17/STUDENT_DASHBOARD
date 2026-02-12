import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);   // 🔥 FIXED

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = () => {
    setLoading(true);

    axios.post("http://localhost:8080/auth/login", form)
      .then(res => {
        setLoading(false);

        if(res.data){
          localStorage.setItem("token", res.data);
          onLogin(res.data);
        } else {
          setError("Invalid credentials");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Server error");
      });
  };

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#f4f6f8"
    }}>
      <div style={{
        padding:"30px",
        background:"white",
        borderRadius:"10px",
        boxShadow:"0px 4px 12px rgba(0,0,0,0.1)",
        width:"320px"
      }}>
        <h2>Login</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={{width:"100%", marginBottom:"10px", padding:"10px"}}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{width:"100%", marginBottom:"10px", padding:"10px"}}
        />

        <button
          onClick={loginUser}
          style={{
            width:"100%",
            padding:"12px",
            background:"#1976d2",
            color:"white",
            border:"none",
            borderRadius:"6px",
            fontWeight:"bold"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{color:"red", marginTop:"10px"}}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;