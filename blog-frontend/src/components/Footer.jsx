import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();

    // List of paths where the footer should be hidden
    const hiddenPaths = ["/login", "/verify-email", "/forgot-password", "/reset-password"];

    // Hide footer if the current path is in the hiddenPaths list
    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <footer className="bg-gray-900 text-white py-6 mt-10">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} MyBlog. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
