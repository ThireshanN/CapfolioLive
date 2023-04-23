import React, { useState } from 'react';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, password, confirmPassword);
  };

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
                Already registered <a href="/sign-in">Sign In?</a>
              </p>
              <div>
                <a id="loginButton" href="http://localhost:3000/auth/google">
                  Login with Google
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SignUp;