import React, { useEffect, useState } from "react";
import api from "./api/axiosClient";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return setAuthed(false);
      try {
        const { data } = await api.get("/auth/me");
        // Use the user's name or fallback to email
        setUserName(data.user?.name || data.user?.email || "");
        setAuthed(true);
      } catch (_e) {
        localStorage.removeItem("token");
        setAuthed(false);
      }
    })();
  }, []);

  if (!authed) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          marginTop: 80,
        }}
      >
        <div style={{ width: 200 }}>
          <Login onAuthSuccess={() => setAuthed(true)} />
        </div>
      </div>
    );
  }

  return <Dashboard userName={userName} onLogout={() => setAuthed(false)} />;
}
