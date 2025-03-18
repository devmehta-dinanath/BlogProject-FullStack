
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phone: "",
//     first_name: "",
//     last_name: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Validate phone number
//   const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

//   // ✅ Validate email format
//   const validateEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // ✅ Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     // ✅ Validation checks
//     if (!validatePhoneNumber(formData.phone)) {
//       setLoading(false);
//       setError("Please enter a valid 10-digit phone number.");
//       alert("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     if (!validateEmail(formData.email)) {
//       setLoading(false);
//       setError("Please enter a valid email address.");
//       alert("Please enter a valid email address.");
//       return;
//     }

//     try {
//       // ✅ Show processing message
//       setMessage("Sending verification link...");

//       const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         // ✅ Handle HTML error response gracefully
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.includes("application/json")) {
//           const data = await response.json();
//           setError(data?.message || "Something went wrong. Please try again.");
//         } else {
//           const text = await response.text();
//           console.error("Server Error:", text);
//           setError("Something went wrong on the server. Check backend logs.");
//         }
//       } else {
//         setMessage("✅ Verification link has been sent to your registered email ID.");
//         alert("Verification link has been sent to your registered email ID.");

//         // ✅ Clear form after success
//         setFormData({
//           username: "",
//           email: "",
//           password: "",
//           phone: "",
//           first_name: "",
//           last_name: "",
//         });
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Something went wrong. Please try again.");
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>

//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           {/* First Name */}
//           <div className="flex items-center border border-gray-300 rounded p-2">
//             <FiUser className="text-gray-400 mr-2" />
//             <input
//               type="text"
//               name="first_name"
//               placeholder="First Name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className="w-full outline-none"
//               required
//             />
//           </div>

//           {/* Last Name */}
//           <div className="flex items-center border border-gray-300 rounded p-2">
//             <FiUser className="text-gray-400 mr-2" />
//             <input
//               type="text"
//               name="last_name"
//               placeholder="Last Name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className="w-full outline-none"
//               required
//             />
//           </div>

//           {/* Username */}
//           <div className="flex items-center border border-gray-300 rounded p-2">
//             <FiUser className="text-gray-400 mr-2" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full outline-none"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="flex items-center border border-gray-300 rounded p-2">
//             <FiMail className="text-gray-400 mr-2" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full outline-none"
//               required
//             />
//           </div>

//           {/* Phone */}
//           <div className="flex items-center border border-gray-300 rounded p-2">
//             <FiPhone className="text-gray-400 mr-2" />
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Phone Number"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full outline-none"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="flex items-center border border-gray-300 rounded p-2 relative">
//             <FiLock className="text-gray-400 mr-2" />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full outline-none"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-2"
//             >
//               {showPassword ? <FiEyeOff /> : <FiEye />}
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full text-white p-2 rounded ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Register"}
//           </button>
//         </form>

//         {/* Error/Success Messages */}
//         {error && <p className="text-red-500 text-center mt-2">{error}</p>}
//         {message && <p className="text-green-500 text-center mt-2">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Register;
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    first_name: "",
    last_name: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validate phone number
  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

  // ✅ Validate email format
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation checks
    if (!validatePhoneNumber(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // ✅ Show processing toast
    const loadingToast = toast.loading("Sending verification link...");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // ✅ Handle HTML error response gracefully
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          toast.update(loadingToast, {
            render: data?.message || "Something went wrong. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 3000
          });
        } else {
          const text = await response.text();
          console.error("Server Error:", text);
          toast.update(loadingToast, {
            render: "Something went wrong on the server. Check backend logs.",
            type: "error",
            isLoading: false,
            autoClose: 3000
          });
        }
      } else {
        toast.update(loadingToast, {
          render: "✅ Verification link has been sent to your registered email ID.",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });

        // ✅ Clear form after success
        setFormData({
          username: "",
          email: "",
          password: "",
          phone: "",
          first_name: "",
          last_name: "",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.update(loadingToast, {
        render: "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* First Name */}
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FiUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FiUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Username */}
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FiUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FiMail className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FiPhone className="text-gray-400 mr-2" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded p-2 relative">
            <FiLock className="text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Register;
