import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    profile_picture: null,
  });

  const navigate = useNavigate();

  // ✅ Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        toast.error("Error fetching profile!");
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData({ ...formData, profile_picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Refresh Token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        navigate("/login");
        return null;
      }
    } catch (error) {
      toast.error("Session expired. Please log in again.");
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('phone', formData.phone);
  
    if (formData.profile_picture instanceof File) {
      data.append('profile_picture', formData.profile_picture);
    }
  
    try {
      const token = localStorage.getItem("accessToken");
  
      let response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
  
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          response = await fetch('http://127.0.0.1:8000/api/profile/', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
            body: data,
          });
        }
      }
  
      if (response.ok) {
        const updatedData = await response.json();
  
        // ✅ Update user state with new data
        setUser((prevUser) => ({
          ...prevUser,
          ...updatedData, // ✅ Spread updated data into state
        }));
  
        // ✅ Update localStorage with new profile data
        localStorage.setItem("user", JSON.stringify(updatedData));
  
        // ✅ Update profile picture separately in localStorage
        if (updatedData.profile_picture) {
          localStorage.setItem("profile_picture", updatedData.profile_picture);
        }
  
        toast.success("✅ Profile updated successfully!");
        
        // ✅ Redirect after success
        setTimeout(() => navigate("/"), 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First and Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="input-field"
          />

          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-field"
          />
        </div>

        {/* Username */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="input-field"
        />

        {/* Email (Non-Editable) */}
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          readOnly // ✅ Make email non-editable
          className="input-field bg-gray-100 cursor-not-allowed text-gray-500"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="input-field"
        />

        {/* Profile Picture */}
        <input
          type="file"
          onChange={handleChange}
          className="file-input"
        />

        {/* Save Button */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-300">
          Save Changes
        </button>
      </form>
    </div>
  );
};

// ✅ Tailwind CSS styles
const styles = `
.input-field {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring focus:ring-blue-300 focus:outline-none transition duration-200;
}

.file-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer focus:outline-none transition duration-200;
}

.error {
  @apply text-red-500 text-sm;
}

.success {
  @apply text-green-500 text-sm;
}

button {
  @apply w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-300;
}
`;

export default Profile;



// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Profile = ({ user, setUser }) => {
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     username: "",
//     email: "",
//     phone: "",
//     profile_picture: null,
//   });

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   // ✅ Fetch User Profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await fetch("http://127.0.0.1:8000/api/profile/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setFormData(data);
//         } else {
//           throw new Error("Failed to fetch profile");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ✅ Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'profile_picture') {
//       setFormData({ ...formData, profile_picture: files[0] }); // ✅ Store File object directly
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };
  

//   // ✅ Handle File Upload
//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       profile_picture: e.target.files[0],
//     }));
//   };

//   // ✅ Refresh Token Function
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       const response = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem("accessToken", data.access);
//         return data.access;
//       } else {
//         // If refresh token is invalid, logout user
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         setUser(null);
//         navigate("/login");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error refreshing token:", error);
//       return null;
//     }
//   };

//   // // ✅ Handle Form Submit
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError("");
//   //   setMessage("");

//   //   let token = localStorage.getItem("accessToken");
//   //   let body;
//   //   let headers = {
//   //     Authorization: `Bearer ${token}`,
//   //   };

//   //     // ✅ Send null if no file is selected
//   // if (formData.profile_picture) {
//   //   formData.append('profile_picture', formData.profile_picture);
//   // } else {
//   //   formData.append('profile_picture', null);
//   // }

//   //   // ✅ Use FormData if uploading file
//   //   if (formData.profile_picture) {
//   //     body = new FormData();
//   //     for (const key in formData) {
//   //       if (formData[key] !== undefined && formData[key] !== null) {
//   //         body.append(key, formData[key]);
//   //       }
//   //     }
//   //   } else {
//   //     // ✅ If no file, send as JSON
//   //     const data = { ...formData };
//   //     delete data.profile_picture;
//   //     body = JSON.stringify(data);
//   //     headers["Content-Type"] = "application/json";
//   //   }

//   //   try {
//   //     let response = await fetch("http://127.0.0.1:8000/api/profile/", {
//   //       method: "PUT",
//   //       headers,
//   //       body,
//   //     });

//   //     if (response.status === 401) {
//   //       // ✅ Try refreshing token and retry request
//   //       const newToken = await refreshToken();
//   //       if (newToken) {
//   //         headers["Authorization"] = `Bearer ${newToken}`;
//   //         response = await fetch("http://127.0.0.1:8000/api/profile/", {
//   //           method: "PUT",
//   //           headers,
//   //           body,
//   //         });
//   //       }
//   //     }

//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       setUser(data);
//   //       setMessage("✅ Profile updated successfully!");

//   //       if (data.profile_picture) {
//   //         localStorage.setItem("profile_picture", data.profile_picture);
//   //       }

//   //       setTimeout(() => navigate("/"), 1500);
//   //     } else {
//   //       const errorData = await response.json();
//   //       setError(errorData.detail || "Failed to update profile");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error updating profile:", error);
//   //     setError("Something went wrong.");
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const data = new FormData();
//     data.append('username', formData.username);
//     data.append('email', formData.email);
//     data.append('first_name', formData.first_name);
//     data.append('last_name', formData.last_name);
//     data.append('phone', formData.phone);
  
//     // ✅ Only send profile_picture if it's a file
//     if (formData.profile_picture instanceof File) {
//       data.append('profile_picture', formData.profile_picture);
//     } else {
//       data.append('profile_picture', '');
//     }
  
//     try {
//       const token = localStorage.getItem("accessToken");
  
//       const response = await fetch('http://127.0.0.1:8000/api/profile/', {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: data, // ✅ Use FormData for file upload
//       });
  
//       if (response.ok) {
//         const updatedData = await response.json();
//         console.log('Profile updated:', updatedData);
//         setUser(updatedData);
//       } else {
//         const errorData = await response.json();
//         console.error('Error updating profile:', errorData);
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//     }
//   };
  
  
//   // const handleUpdate = async (e) => {
//   //   e.preventDefault();
  
//   //   const formData = new FormData();
//   //   formData.append('username', formData.username);
//   //   formData.append('email', formData.email);
//   //   formData.append('first_name', formData.first_name);
//   //   formData.append('last_name', formData.last_name);
//   //   formData.append('phone', formData.phone);
//   //   if (formData.profile_picture) {
//   //     formData.append('profile_picture', formData.profile_picture);
//   //   }
  
//   //   try {
//   //     const token = localStorage.getItem("accessToken");
  
//   //     const response = await fetch('http://127.0.0.1:8000/api/profile/', {
//   //       method: 'PUT',
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: formData, // ✅ Use FormData for file uploads
//   //     });
  
//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       console.log('Profile updated:', data);
//   //       setUser(data);
//   //     } else {
//   //       const errorData = await response.json();
//   //       console.error('Error updating profile:', errorData);
//   //     }
//   //   } catch (error) {
//   //     console.error('Network error:', error);
//   //   }
//   // };
  

//   return (
//     <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
//       {message && <p className="text-green-500">{message}</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="input" />
//         <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="input" />
//         <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="input" />
//         <input type="email" name="email" value={formData.email} placeholder="Email" className="input" disabled />
//         <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input" />
//         <input type="file" onChange={handleFileChange} className="input" />
//         <button type="submit" className="btn bg-blue-500">Save Changes</button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
