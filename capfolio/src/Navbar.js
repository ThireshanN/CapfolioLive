import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuthenticated(user !== null);
    }, [user]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/logout");
            if (response.ok) {
                const data = await response.json();
                setUser(null);
                setIsAuthenticated(false);
                navigate("/");
            } else {
                console.error("Error logging out:", response.statusText);
            }
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };
    return (
        <nav className="navtop">
            <Link to="/" className="site-title">
                <div className="logo">
                    <img
                        src={require("./images/capfolio-logo-white.png")}
                        alt="Logo"
                    />
                </div>
            </Link>
            <ul>
                {!isAuthenticated ? (
                    <>
                        <CustomLink to="/login" className="button2">
                            Log in
                        </CustomLink>
                        <CustomLink to="/sign-up" className="button2">
                            Sign Up
                        </CustomLink>
                    </>
                ) : (
                    <>
                        <CustomLink to="/profile" className="button2">
                            Profile
                        </CustomLink>
                        <button className="button2" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}