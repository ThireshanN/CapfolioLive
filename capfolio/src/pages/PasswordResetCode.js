import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordResetCode = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Send password reset code to the user's email

    // Display a success message to the user
    setMessage(`Password reset code sent to ${email}`);
  };

  return (
    <div className="container">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <h3>Password Reset</h3>
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
            <div className="d-grid">
            <Link to="/Rest-Password">
              <button type="submit" className="btn btn-primary">
              Send Reset Code
              </button>
              </Link>
            </div>
            {message && (
              <div className="mt-3 alert alert-info" role="alert">
                {message}
              </div>
            )}
            <p className="forgot-password text-right">
              Remembered your password? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetCode;
