import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';


function Navbar() {
  // get authUser and logout from useAuthStore
  const { authUser, logout } = useAuthStore();
   
 
  return (
    <>
      <nav style={styles.nav} role="navigation" aria-label="Primary">

        {/* branding */}
        <div>
          <Link to="/" style={styles.brandLink} aria-label="Home">
            <h1 style={styles.h1}>My App</h1>
          </Link>
        </div>

        {/* display user controls  */}
        <div style={styles.controls}>
          {authUser ? (
            <div style={styles.userArea} aria-live="polite">
              <span style={styles.welcome}>
                Welcome, {authUser._id}
              </span>
              <Link to={`/profile/${authUser._id}`} style={{ ...styles.btnBase, ...styles.linkBtn }}>
                Profile
              </Link>
              <button type="button" onClick={logout} style={{ ...styles.btnBase, ...styles.logoutBtn }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link to="/login" style={{ ...styles.btnBase, ...styles.linkBtn }}>
                Login
              </Link>
              <Link to="/signup" style={{ ...styles.btnBase, ...styles.linkBtn }}>
                Signup
              </Link>
            </div>
          )}
        </div>
        
      </nav>
    </>

  )
}


const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 20px",
    background: "linear-gradient(180deg, #0f1724, #081023 80%)",
    color: "#e6eef8",
    boxShadow: "0 6px 18px rgba(2,6,23,0.6)",
    position: "sticky",
    top: 0,
    zIndex: 40,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    fontFamily:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  brandLink: {
    color: "inherit",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  h1: {
    margin: 0,
    fontSize: "1.05rem",
    letterSpacing: "-0.2px",
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  welcome: {
    display: "inline-block",
    fontSize: "0.95rem",
    color: "#e6eef8",
    marginRight: 6,
  },
  btnBase: {
    appearance: "none",
    border: 0,
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: "0.93rem",
    cursor: "pointer",
    transition: "transform .08s ease, box-shadow .12s ease, opacity .12s ease",
    background: "rgba(255,255,255,0.04)",
    color: "#e6eef8",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  },
  logoutBtn: {
    background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(79,70,229,0.16)",
  },
  linkBtn: {
    border: "1px solid rgba(255,255,255,0.06)",
    background: "transparent",
    padding: "6px 10px",
    borderRadius: 8,
    color: "inherit",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userArea: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};

export default Navbar