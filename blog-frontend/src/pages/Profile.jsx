
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

  // Fetch User Profile
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

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData({ ...formData, profile_picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Form Submission
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
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser((prevUser) => ({ ...prevUser, ...updatedData }));
        localStorage.setItem("user", JSON.stringify(updatedData));
        if (updatedData.profile_picture) {
          localStorage.setItem("profile_picture", updatedData.profile_picture);
        }
        toast.success("Profile updated successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Redirect to Reset Password Page
  const handleResetPassword = () => {
    navigate("/change-password");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="input-field" />
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="input-field" />
        </div>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="input-field" />
        <input type="email" name="email" value={formData.email} placeholder="Email" readOnly className="input-field bg-gray-100 cursor-not-allowed text-gray-500" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input-field" />
        <input type="file" name="profile_picture" onChange={handleChange} className="file-input" accept="image/*" />
        <button type="button" onClick={handleResetPassword} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition duration-300">Change Password</button>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-300">Save Changes</button>
       
      </form>
    </div>
  );
};


//  Tailwind CSS styles
const styles = `
.input-field {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring focus:ring-blue-300 focus:outline-none transition duration-200;
}

.file-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer focus:outline-none transition duration-200;
}
`;
export default Profile;
