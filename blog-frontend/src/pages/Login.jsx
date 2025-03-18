
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ login_field: "", password: "" });
  const [error, setError] = useState("");
  const [showResendLink, setShowResendLink] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle form input changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResendLink(false); // ✅ Reset resend link state
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Raw response:", data); // ✅ Debugging log
  
      if (response.ok) {
        console.log("Login successful:", data); // ✅ Log for debugging
  
        // ✅ Store tokens and user data
        localStorage.setItem("accessToken", data?.access_token);
        localStorage.setItem("refreshToken", data?.refresh_token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        localStorage.setItem("authorId", data?.user?.id);
  
        if (data?.user?.profile_picture) {
          localStorage.setItem("profile_picture", data.user.profile_picture);
        }
  
        setUser(data.user); // ✅ Update user state
        navigate("/dashboard");
      } else {
        // ✅ Handle `non_field_errors` and other error cases
        if (data?.non_field_errors) {
          setError(data.non_field_errors[0]);
  
          // ✅ If the error is related to email verification, show resend link
          if (data.non_field_errors[0] === "Please verify your email first.") {
            setShowResendLink(true);
          }
        } else {
          setError(data?.detail || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const resendVerificationLink = async () => {
  try {
      let email = formData.login_field;

      // ✅ Check if login_field is email, phone, or username
      if (!email.includes("@")) {
          const response = await fetch(`http://127.0.0.1:8000/api/auth/get-email/`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ login_field: formData.login_field }),
          });

          const data = await response.json();
          if (response.ok) {
              email = data.email; // ✅ Use the extracted email
          } else {
              throw new Error(data.error || "Failed to retrieve email.");
          }
      }

      // ✅ Send the email to resend verification
      const response = await fetch("http://127.0.0.1:8000/api/auth/resend-verification-email/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
          alert("Verification link sent. Please check your email.");
          setShowResendLink(false);
      } else {
          setError(data.error || "Failed to send verification link.");
      }
  } catch (error) {
      console.error("Resend verification link error:", error);
      setError("Something went wrong. Please try again.");
  }
};




  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="login_field"
            placeholder="Email or Username"
            className="w-full p-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            value={formData.login_field}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

{/* ✅ Resend Verification Link */}
{showResendLink && (
  <div className="mt-4 text-center">
    <p className="text-sm text-gray-600">
      Didn't receive the verification email?{" "}
      <button
        onClick={resendVerificationLink}
        className="text-blue-600 hover:underline"
      >
        Resend Verification Link
      </button>
    </p>
  </div>
)}


        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
