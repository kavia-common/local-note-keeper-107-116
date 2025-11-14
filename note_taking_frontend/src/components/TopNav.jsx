import React from "react";

// PUBLIC_INTERFACE
/**
 * Top navigation bar component for the note-taking app.
 */
const TopNav = () => (
  <nav
    style={{
      height: 56,
      background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 90%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      padding: "0 1.3em",
      justifyContent: "flex-start",
      fontWeight: 700,
      letterSpacing: "0.04em",
      boxShadow: "0 2px 8px rgba(59,130,246,0.10)",
      // borderBottom: "1px solid var(--surface-border)"
    }}
    data-testid="topnav"
  >
    <span style={{ fontSize: "1.25rem", color: "inherit" }}>Local Note Keeper</span>
  </nav>
);

export default TopNav;
