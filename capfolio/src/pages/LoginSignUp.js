import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from '../images/btn_google_signin_dark_pressed_web@2x.png';

const LoginSignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Keep track of whether it's a signup or login form

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

    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const url = isSignUp ? 'http://localhost:3000/auth/signup' : 'http://localhost:3000/auth/login';
    const body = isSignUp ? { firstName, lastName, email, password } : { email, password };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const redirectUrl = isSignUp ? '/login' : '/';
      window.location.href = redirectUrl;
    } else {
      alert(isSignUp ? 'Failed to sign up' : 'Failed to log in');
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    // Reset form fields when switching between login and signup
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="container">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form className="cent" onSubmit={handleSubmit}>
            <h3>{isSignUp ? 'Sign Up' : 'Log in'}</h3>
            {isSignUp && (
              <>
                <div className="mb-3">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={firstName}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    id="lastName"
                    placeholder="Last Name"
                  />
                </div>
              </>
            )}
            <div className="mb-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                id="password"
                placeholder="Enter password"
              />
            </div>
            {isSignUp && (
              <div className="mb-3">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  id="confirmPassword"
                  placeholder="Confirm password"
                />
              </div>
            )}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {isSignUp ? 'Sign Up' : 'Log in'}
              </button>
            </div>
            {isSignUp ? (
              <p className="forgot-password text-right">
                Already registered?{' '}
                <Link to="/login" onClick={toggleForm}>
                  Log In
                </Link>
              </p>
            ) : (
              <p className="register text-center">
                Don't have an account?{' '}
                <Link to="/sign-up" onClick={toggleForm}>
                  Sign Up
                </Link>
              </p>
            )}
            <div>
              <a id="loginButton" href="http://localhost:3000/auth/google">
                <img className="resize-google-button" src={GoogleLogin} alt="Google Login" />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
