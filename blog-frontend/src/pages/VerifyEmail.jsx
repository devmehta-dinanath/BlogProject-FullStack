import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { uid, token } = useParams(); // Get uid & token from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      // console.log("Verifying email with:", uid, token); //  Debugging

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/auth/verify-email/${encodeURIComponent(uid)}/${encodeURIComponent(token)}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log("Verification success:", data); //  Debugging

          setMessage("✅ Email verified. Redirecting to login...");
          setTimeout(() => navigate("/login"), 1000); // Redirect to login after 1 sec
        } else {
          const errorData = await response.json();
          // console.error("Verification error:", errorData); //  Debugging

          setMessage("❌ Verification failed. Link may be invalid or expired.");
        }
      } catch (error) {
        // console.error("Fetch error:", error); //  Debugging
        setMessage("❌ An error occurred. Please try again later.");
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700">{message}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;

