import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
      <nav className="navtop">
      <Link to="/" className="site-title">
      <div className="logo"><img src={require('./images/capfolio-logo-white.png')}  alt="Logo" /></div>
      </Link>
      <ul>
        <CustomLink to="/login" className="button2">Log in</CustomLink>
              <CustomLink to="/sign-up" className="button2">Sign Up</CustomLink>
              <CustomLink to="/project-submit" className="button2">Project Submit </CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}