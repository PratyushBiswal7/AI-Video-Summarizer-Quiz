import React from 'react';
import Header from '../components/Header';
import Home from './Home';

export default function Dashboard({ onLogout, userName }) {
  return (
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <Header userName={userName} onLogout={onLogout} />
      <Home />
    </div>
  );
}
