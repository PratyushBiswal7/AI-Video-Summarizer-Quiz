import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

export default function Login({ onAuthSuccess }) {
  const [showSignup, setShowSignup] = useState(false);

  // Callback for when signup succeeds
  const handleSignupSuccess = () => {
    alert('Signup successful, please login');
    setShowSignup(false); // redirect user to login form view
  };

  return (
    <div>
      {!showSignup ? (
        <>
          <h2>Login</h2>
          <AuthForm mode="login" onSuccess={onAuthSuccess} />
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => setShowSignup(true)}
              style={{ border: 'none', background: 'none', color: '#06c', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Sign up
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>Create Account</h2>
          <AuthForm mode="signup" onSuccess={handleSignupSuccess} />
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setShowSignup(false)}
              style={{ border: 'none', background: 'none', color: '#06c', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Login
            </button>
          </p>
        </>
      )}
    </div>
  );
}
