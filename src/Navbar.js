import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
      <div className="logo"><img src={require('./capfolio-logo-black.png')}  alt="Logo" /></div>
      </Link>
      <ul>
        <CustomLink to="/login" className="button2">Login</CustomLink>
        <CustomLink to="/sign-up" className="button2">SignUp</CustomLink>
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