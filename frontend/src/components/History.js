import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function History({ onSelect }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/video/history");
        setItems(data);
      } catch (_e) {
        setItems([]);
      }
    })();
  }, []);

  if (!items.length) return <p>No history found.</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Your History</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {items.map((v) => (
          <li
            key={v._id}
            style={{
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              onClick={() => onSelect(v)}
              style={{
                background: "none",
                border: "none",
                color: "#06c",
                textDecoration: "underline",
                cursor: "pointer",
                flexGrow: 1,
                textAlign: "left",
                padding: 0,
              }}
            >
              {v.name || v.videoId || v.videoUrl} —{" "}
              {new Date(v.createdAt).toLocaleString()}
            </button>
            <button
              onClick={async () => {
                if (
                  window.confirm("Are you sure to delete this history item?")
                ) {
                  try {
                    await api.delete(`/video/history/${v._id}`);
                    setItems(items.filter((item) => item._id !== v._id));
                  } catch {
                    alert("Delete failed");
                  }
                }
              }}
              style={{
                background: "#f44336",
                color: "#fff",
                border: "none",
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
