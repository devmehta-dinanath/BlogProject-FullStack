import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone); // Exactly 10 digits
  };

  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validatePhoneNumber(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        setMessage("Verification link has been sent to your registered email ID.");
        alert("Verification link has been sent to your registered email ID.");
        navigate("/login"); // Redirect to login after success
      } else {
        const data = await response.json();
        setError(data?.message || "Something went wrong. Please try again.");
        alert(data?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
      alert("Something went wrong. Please try again.");
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
          <div className="flex items-center border border-gray-300 rounded p-2">
            <FiLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {/* Success Message */}
        {message && <p className="text-green-500 text-center mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default Register;


// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";


// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phone: "",
//     first_name: "",  // Correct field name
//     last_name: "",   // Correct field name
//   });
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     try {
//       console.log(formData)
//       const response = await fetch("http://127.0.0.1:8000/api/auth/register/",{
//         method:"POST",
//         headers: {
//           "Content-Type":"application/json"
//         },
//         body: JSON.stringify(formData)
//       })
//        // ✅ Debugging
//       if (response.status==201){
//         console("ok")
//       }
      
//     } catch (error) {
      
//     }
//   };

//   return (
//     <>
     
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>
//           <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//             {/* First Name */}
//             <div className="flex items-center border border-gray-300 rounded p-2">
//               <FiUser className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 name="first_name"  // Corrected
//                 placeholder="First Name"
//                 value={formData.first_name}  // Corrected
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>

//             {/* Last Name */}
//             <div className="flex items-center border border-gray-300 rounded p-2">
//               <FiUser className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 name="last_name"  // Corrected
//                 placeholder="Last Name"
//                 value={formData.last_name}  // Corrected
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>

//             {/* Username */}
//             <div className="flex items-center border border-gray-300 rounded p-2">
//               <FiUser className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div className="flex items-center border border-gray-300 rounded p-2">
//               <FiMail className="text-gray-400 mr-2" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>

//             {/* Phone Number */}
//             <div className="flex items-center border border-gray-300 rounded p-2">
//               <FiPhone className="text-gray-400 mr-2" />
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="flex items-center border border-gray-300 rounded p-2">
//               <FiLock className="text-gray-400 mr-2" />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full outline-none"
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//             >
//               Register
//             </button>
//           </form>

//           {/* Already have an account? */}
//           <p className="text-center text-gray-500 mt-4">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-600 hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;
