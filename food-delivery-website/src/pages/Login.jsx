import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";
import { jwtDecode } from "jwt-decode";
import { FaArrowLeft } from "react-icons/fa";
import loginImg from "../assets/fastfood-login.png";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const token = res.data.token || res.data.data?.token;
      if (!token) throw new Error("Invalid response from server");

      const userData = jwtDecode(token);

      loginUser(userData, token);

      // Redirect based on role
      if (userData.role === "admin") navigate("/admin/dashboard");
      else navigate("/menu");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-300 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Menu (KEEP SAME) */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center text-sm sm:text-base text-red-600 font-medium hover:text-red-700"
        >
          <FaArrowLeft className="mr-2" />
          Back to Menu
        </button>
      </div>

      {/* Split Login Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE - FORM */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition
              ${
                loading
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 active:scale-95"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-5 text-sm text-gray-600">
            <p className="text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-red-500 font-medium hover:underline"
              >
                Register
              </Link>
            </p>
            <p className="mt-2 text-center">
              <Link to="/register" className="text-red-500 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={loginImg}
            alt="Food Delivery"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold px-6 text-center"></h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
