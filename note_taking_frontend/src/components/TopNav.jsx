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
    // Accessible focus for nav itself and any nav items in future
    tabIndex={0}
    onFocus={e => { e.currentTarget.style.boxShadow = "0 0 0 2px #991b1b, 0 2px 8px rgba(185,28,28,0.17)"; }}
    onBlur={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(185,28,28,0.17)"; }}
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
      All future nav items/links/buttons:
      - background: "transparent" or "var(--topnav-accent)" for active
      - color: "#fff"
      - on hover/focus: background: "rgba(255,255,255,0.11)" (no gradient), color: "#fff"
    */}
  </nav>
);

export default TopNav;
