import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './pages.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
      // Fetch the user data from the server
      const userResponse = await fetch('http://localhost:3000/auth/user');
      const userData = await userResponse.json();

      // Update the context with the user data
      setUser(userData);

      // Redirect to the home page
      window.location.href = '/';
    } else {
      alert('Failed to log in');
    }
  };

  return (
      <div className="container">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form className="cent" onSubmit={handleSubmit}>
              <h3>Log in</h3>
              <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => handleInputChange(e)}
                    id="email"
                    placeholder="Enter email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => handleInputChange(e)}
                    id="password"
                    placeholder="Enter password"
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Log in
                </button>
              </div>
              <p className="forgot-password text-right">
                Forgot <a href="#">password?</a>
              </p>
              <div>
                <a id="loginButton" href="http://localhost:3000/auth/google">
                  Login with Google
                </a>
              </div>
              <p className="register text-center">
                Don't have an account? <Link to="/sign-up">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Login;