import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
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
      setMessage('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (response.status === 200) {
      setMessage('Password reset successful!');
    } else {
      setMessage('Failed to reset password');
    }
  };

  return (
    <div className="container">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <h3>Reset Password</h3>
            <div className="mb-3">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={handleInputChange}
                id="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={handleInputChange}
                id="confirmPassword"
                placeholder="Confirm new password"
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Reset Password
              </button>
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

export default ResetPassword;