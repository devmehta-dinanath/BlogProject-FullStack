import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/auth/password-reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    if (response.status === 200) {
      setMessage("Password reset link has been sent to your email.");
    } else {
      setMessage("Invalid email address.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border p-2 mt-4"
          required
        />
        <button className="w-full bg-blue-500 text-white mt-4 p-2 rounded">
          Send Reset Link
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
