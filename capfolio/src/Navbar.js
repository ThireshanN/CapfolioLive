import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    

    useEffect(() => {
        setIsAuthenticated(user !== null);
    }, [user]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/logout");
            if (response.ok) {
                const data = await response.json();
                Cookies.remove('connect.sid', { path: '/' });
                console.log(Cookies.get('connect.sid'))
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
      };
    return (
        <nav className="navtop">
            <Link to="/" className="site-title">
                <div className="logo">
                    <img
                        src={require("./images/capfoliov2.png")}
                        alt="Logo"
                    />
                </div>
            </Link>
            <ul className="nav-desktop">
                {!isAuthenticated ? (
                    <>
                        <CustomLink to="/Admin-Page" className="login">
                            Log in
                        </CustomLink>
                        <CustomLink to="/sign-up" className="signup">
                            Sign up
                        </CustomLink>
                    </>
                ) : (
                    <>
                        <CustomLink to="/profile" className="login">
                            Profile
                        </CustomLink>
                        <CustomLink to="/"className="signup" onClick={handleLogout}>
                            Logout
                        </CustomLink>
                    </>
                )}
            </ul>
            <div className="nav-mobile">
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu} sx={{ bgcolor: '#72a0e9', margin: "40px 0px 0px -12px", }}>
                    <MenuIcon />
                </IconButton>
                <Drawer
                anchor="left"
                open={menuOpen}
                onClose={toggleMenu}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '200px',
                        '@media (min-width: 500px)': {
                            width: '400px',
                        },
                    },
                }}
            >
                    <List>
                        {!isAuthenticated ? (
                            <>
                                <ListItem button component={Link} to="/login" onClick={toggleMenu}>
                                    <ListItemText primary="Log in" />
                                </ListItem>
                                <ListItem button component={Link} to="/sign-up" onClick={toggleMenu}>
                                    <ListItemText primary="Sign up" />
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem button component={Link} to="/profile" onClick={toggleMenu}>
                                    <ListItemText primary="Profile" />
                                </ListItem>
                                <ListItem button component={Link} to="/" onClick={handleLogout}>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </>
                        )}
                    </List>
                </Drawer>
            </div>
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