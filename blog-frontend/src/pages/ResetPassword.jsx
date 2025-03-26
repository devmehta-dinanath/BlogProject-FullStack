import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error(" All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error(" Passwords do not match.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("⏳ Resetting password...");

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/password-reset/${uid}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: password,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        toast.update(toastId, {
          render: " Password reset successful! Redirecting to login...",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          icon: false,
        });

        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.update(toastId, {
          render: data?.error || "❌ Password reset failed.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          icon: false,
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.update(toastId, {
        render: "❌ Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        icon: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Reset Password
        </h2>

        {/* ✅ New Password Field */}
        <div className="relative mt-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </div>

        {/*  Confirm Password Field */}
        <div className="relative mt-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </div>

        {/*  Submit Button */}
        <button
          type="submit"
          className={`w-full text-white py-2 mt-4 rounded-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
