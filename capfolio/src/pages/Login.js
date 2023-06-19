import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './pages.css';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

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

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
      // Fetch the user data from the server
      const userResponse = await fetch('/auth/user');
      const userData = await userResponse.json();

      // Update the context with the user data
      setUser(userData);

      // Redirect to the home page
      window.location.href = '/';
    } else {
      const errorData = await response.json();
      alert(errorData.error);
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
                 <Link to="/Email-Password">Forgot password?</Link>
              </p>
              <p className="register text-center">
                 <Link to="/sign-up">Don't have an account? Sign Up</Link>
              </p>
              <div>
              <Button variant="outlined" href="/auth/google" style={{ width: '378px', padding: '4.91px' }}>
                <GoogleIcon /> Sign In With Google
              </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Login;