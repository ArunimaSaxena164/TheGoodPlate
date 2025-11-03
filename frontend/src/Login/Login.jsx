import { useState } from "react";
import axios from "axios";
import "./Login.css"

function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Determine whether the input is an email or phone number
      const payload = formData.emailOrPhone.includes("@")
        ? { email: formData.emailOrPhone, password: formData.password }
        : { phone: formData.emailOrPhone, password: formData.password };

      const res = await axios.post("http://localhost:5000/api/auth/login", payload);
      setMessage("Login successful!");
      setFormData({ emailOrPhone: "", password: "" });

      // optionally store token in localStorage
      localStorage.setItem("token", res.data.token);

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
     <div className="login-page">
      <div className="login-box">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="emailOrPhone" className="form-label">
            Email or Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="emailOrPhone"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="Enter your email or phone number"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      {message && <p className="text-center mt-3">{message}</p>}

      <p className="text-center mt-3">
        Don’t have an account?{" "}
        <a href="/signup" className="text-decoration-none">
          Sign up
        </a>
      </p>
    </div>
    </div>
  );
}

export default Login;
