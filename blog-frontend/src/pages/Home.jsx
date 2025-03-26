import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";

const Home = ({ user }) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, []);

  const handleGetStarted = () => {
    // console.log("USER STATE IN HOME:", user); // Debugging user state
    if (user?.id) {
      console.log("Redirecting to CreateBlog");
      navigate("/dashboard"); // Redirect if logged in
    } else {
      console.log("❌ Redirecting to Login");
      navigate("/login"); // Redirect to login if logged out
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-gray-100 p-6">
      <img src={logo} alt="Blog Logo" className="h-24 w-24 mb-4 rounded-full shadow-lg" />
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Welcome to MyBlog
      </h1>
      <p className="text-lg text-gray-600 mt-2 text-center">
        Share your thoughts and connect with others.
      </p>
      <button 
  onClick={handleGetStarted}
  className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
>
  Get Started
</button>

    </div>
  );
};

export default Home;
