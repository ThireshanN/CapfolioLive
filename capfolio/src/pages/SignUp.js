import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    if (response.status === 200) {
      navigate('/Code-Confirmation');
    } else {
      alert('Failed to sign up');
    }
  }

  return (
    
      <div className="container">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form className="cent" onSubmit={handleSubmit}>
              <h3>Sign Up</h3>
              <div className="mb-3">
                <label htmlFor="firstName">First Name</label>
                <input
                    className="form-control"
                    type="text"
                    value={firstName}
                    onChange={(e) => handleInputChange(e)}
                    id="firstName"
                    placeholder="First Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => handleInputChange(e)}
                    id="lastName"
                    placeholder="Last Name"
                />
              </div>
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
              <div className="mb-3">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e)}
                    id="confirmPassword"
                    placeholder="Confirm password"
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>
              <p className="forgot-password text-right">
                Already registered <Link to="/login">Sign In?</Link>
              </p>
              <div>
              <Button variant="outlined" href="/auth/google">
                  <GoogleIcon />  Sign In With Google
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      
  );
};

export default SignUp;