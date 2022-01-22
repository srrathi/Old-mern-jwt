import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4001/api/login", {
        email,
        password,
      });
      console.log(res);
      if (res.data.user) {
        alert("Login Successfull !!");
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      alert(error);

      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login User</h2>
        <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <br />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <br />
        <input type="submit" value="Log In" />
      </form>
    </div>
  );
};

export default Login;
