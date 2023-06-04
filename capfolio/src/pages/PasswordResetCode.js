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

    const response = await fetch('/auth/resetPasswordEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (response.status === 200) {
      // Redirect to the ResetPassword page
      // I hate Front end coding btw. So tedious. And also if ur reading this its a msg from the past.
      window.location.href = '/Rest-Password';
    } else {
      const errorData = await response.json();
      alert(errorData.error);
    }

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

              <button type="submit" className="btn btn-primary">
              Send Reset Code
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

export default PasswordResetCode;
