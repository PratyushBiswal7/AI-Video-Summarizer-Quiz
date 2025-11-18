import React from 'react';
import AuthForm from '../components/AuthForm';

export default function Signup() {
  return (
    <div>
      <h2>Sign Up</h2>
      <AuthForm mode="signup" />
    </div>
  );
}
