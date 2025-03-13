
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ login_field: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle login submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     if (response.status === 200) {
  //       const data = await response.json();

  //       // ✅ Store tokens in localStorage
  //       localStorage.setItem("accessToken", data.access_token);
  //       localStorage.setItem("refreshToken", data.refresh_token);

  //       // ✅ Save complete user data to localStorage
  //       const userData = {
  //         id: data.user.id, // ✅ Make sure id exists in the response
  //         username: data.user.username,
  //         email: data.user.email,
  //         phone: data.user.phone || "",
  //         profile_picture: data.user.profile_picture || null,
  //         first_name: data.user.first_name || "",
  //         last_name: data.user.last_name || "",
  //       };

  //       console.log("User Data:", userData); // ✅ Debugging check

  //       // ✅ Store user in localStorage
  //       localStorage.setItem("user", JSON.stringify(userData));
  //       if (userData.profile_picture) {
  //         localStorage.setItem("profile_picture", userData.profile_picture);
  //       }

  //       // ✅ Update global state
  //       setUser(userData);

  //       navigate("/"); // ✅ Redirect to home after login
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.detail || "Login failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError("Something went wrong. Please try again.");
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(formData)
  //     });
  
  //     if (response.status === 200) {
  //       const data = await response.json();
  
  //       // ✅ Store tokens in localStorage
  //       localStorage.setItem("accessToken", data.access_token);
  //       localStorage.setItem("refreshToken", data.refresh_token);
  
  //       // ✅ Store full user data in localStorage
  //       const userData = {
  //         id: data.user.id,
  //         username: data.user.username,
  //         email: data.user.email,
  //         phone: data.user.phone || "",
  //         profile_picture: data.user.profile_picture || null,
  //         first_name: data.user.first_name || "",
  //         last_name: data.user.last_name || "",
  //       };
  
  //       console.log("User Data:", userData); // ✅ Debugging
  
  //       localStorage.setItem("user", JSON.stringify(userData));
  //       if (userData.profile_picture) {
  //         localStorage.setItem("profile_picture", userData.profile_picture);
  //       }
  
  //       // ✅ Update state
  //       setUser(userData);
  
  //       navigate("/"); // ✅ Redirect to home
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.detail || "Login failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError("Something went wrong. Please try again.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      if (response.status === 200) {
        const data = await response.json();
  
        // ✅ Store tokens in localStorage
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
  
        // ✅ Store full user data in localStorage
        const userData = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          phone: data.user.phone || "",
          profile_picture: data.user.profile_picture || null,
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
        };
  
        console.log("User Data:", userData); // ✅ Debugging
  
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authorId", userData.id);  // ✅ Store authorId separately
        if (userData.profile_picture) {
          localStorage.setItem("profile_picture", userData.profile_picture);
        }
  
        // ✅ Update state
        setUser(userData);
  
        navigate("/"); // ✅ Redirect to home
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        
        {/* ✅ Error message */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          {/* ✅ Email/Username Input */}
          <input
            type="text"
            name="login_field"
            placeholder="Email or Username"
            className="w-full p-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            value={formData.login_field}
            onChange={handleChange}
            required
          />

          {/* ✅ Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* ✅ Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* ✅ Forgot Password */}
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* ✅ Register Link */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


