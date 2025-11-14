import React from "react";

// PUBLIC_INTERFACE
/**
 * Top navigation bar component for the note-taking app.
 * Uses a reddish theme for background, with white text for strong contrast.
 */
const TopNav = () => (
  <nav
    style={{
      height: 56,
      background: "var(--topnav-bg, #b91c1c)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      padding: "0 1.3em",
      justifyContent: "flex-start",
      fontWeight: 700,
      letterSpacing: "0.04em",
      boxShadow: "0 2px 8px rgba(185,28,28,0.17)",
      position: "relative",
      zIndex: 11
    }}
    data-testid="topnav"
  >
    <span style={{
      fontSize: "1.25rem",
      color: "#fff",
      textShadow: "0 2px 8px #991b1b33",
      letterSpacing: "0.02em"
    }}>
      Local Note Keeper
    </span>
    {/* 
      If future nav items/links/buttons are added, ensure they also use appropriate contrasts:
      background: "transparent" (or var(--topnav-accent) for active), color: "#fff", 
      and for :hover/:focus: background: "rgba(255,255,255,0.11)", color: "#fff"
    */}
  </nav>
);

export default TopNav;
