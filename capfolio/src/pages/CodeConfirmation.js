import React, { useState } from 'react';

const CodeConfirmation = () => {
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/auth/emailVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    if (response.status === 200) {
      // Redirect to the home page
      window.location.href = '/login';
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
            <h3>Check Your Email</h3>
            <p>We've sent a code to your email. Please enter it below to confirm your email address.</p>
            <div className="mb-3">
              <label htmlFor="code">Confirmation Code</label>
              <input
                type="text"
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id="code"
                placeholder="Enter code"
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Confirm Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CodeConfirmation;

