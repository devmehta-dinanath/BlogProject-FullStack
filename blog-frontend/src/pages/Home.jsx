import logo from "../assets/logo.png";

const Home = () => {
  return (
    <>
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <img src={logo} alt="Blog Logo" className="h-24 w-24 mb-4 rounded-full shadow-lg" />
      
      <h1 className="text-4xl font-bold text-gray-800">Welcome to MyBlog</h1>
      <p className="text-lg text-gray-600 mt-2">Share your thoughts and connect with others.</p>
      
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
        Get Started
      </button>
    </div>
    </>
  );
};

export default Home;

