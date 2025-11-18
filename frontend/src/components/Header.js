import React from "react";

export default function Header({ userName, onLogout }) {
  const logout = () => {
    localStorage.removeItem("token");
    onLogout && onLogout();
  };
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        background: "#222",
        color: "#fff",
      }}
    >
      <h2 style={{ margin: 0 }}>AI Video Summarizer & Quiz</h2>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        {userName && <span>Hello, {userName}</span>}
        <button
          onClick={logout}
          style={{
            background: "#f44336",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
