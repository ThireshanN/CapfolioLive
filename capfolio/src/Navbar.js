import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navtop">
      <Link to="/" className="site-title">
        <div className="logo">
          <img src={require('./images/capfolio-logo-white.png')} alt="Logo" />
        </div>
      </Link>
      <ul className="nav-desktop">
        <CustomLink to="/login" className="button2">Log in</CustomLink>
              <CustomLink to="/sign-up" className="button2">Sign Up</CustomLink>
              <CustomLink to="/project-submit" className="button2">Project Submit </CustomLink>
      </ul>
      <div className="menu-icon" onClick={toggleMenu}>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
      </div>
      <ul className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <div className='mobile-nav-btns'>
          <CustomLink to="/login" className="button2" onClick={() => setMenuOpen(false)}>Log in</CustomLink>
          <CustomLink to="/sign-up" className="button2" onClick={() => setMenuOpen(false)}>Sign Up</CustomLink>
        </div>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}