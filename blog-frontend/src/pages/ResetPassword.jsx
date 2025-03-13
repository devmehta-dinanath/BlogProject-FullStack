import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://127.0.0.1:8000/api/auth/password-reset/${uid}/${token}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ new_password: password, confirm_password: confirmPassword })
    });

    if (response.status === 200) {
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage("Password reset failed.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mt-4"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 mt-4"
          required
        />
        <button className="w-full bg-blue-500 text-white mt-4 p-2 rounded">
          Reset Password
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
