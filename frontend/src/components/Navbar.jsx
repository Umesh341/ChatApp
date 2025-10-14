import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';


function Navbar() {
  // get authUser and logout from useAuthStore
  const { authUser, logout, checkAuth } = useAuthStore();
   const [mobileOpen, setMobileOpen] = React.useState(false);

  console.log(authUser)
  return (
    <>
      <nav
        role="navigation"
        aria-label="Primary"
        className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b-1 border-green-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Branding */}
            <div className="flex-shrink-0">
              <Link to="/" aria-label="Home" className="flex items-center gap-3">
                <div className="w-9 h-9  bg-green-600 text-white flex items-center justify-center font-bold ">
                  CA
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Chat App</h1>
              </Link>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center space-x-4">
              {authUser ? (
                <div className="flex items-center gap-3" aria-live="polite">
                  <span className="text-sm text-gray-600">
                    Welcome,&nbsp;
                    {/* <span className="font-medium text-gray-900">{authUser.user.username}</span> */}
                  </span>

                  <button
                    type="button"
                    onClick={logout}
                    className="px-3 py-2 text-sm text-green-600 hover:text-white hover:bg-green-600 transition  focus:ring-2 focus:ring-green-200 border-1 mx-3us:ring-red-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-green-600 hover:text-white hover:bg-green-600 transition  focus:ring-2 focus:ring-green-200 border-1 mx-3"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 text-sm text-green-600 hover:text-white hover:bg-green-600 transition  focus:ring-2 focus:ring-green-200 border-1"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <span className="sr-only">Toggle menu</span>
                {mobileOpen ? (
                  /* X / Close icon */
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  /* Hamburger icon */
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu (collapsible) */}
        <div
          id="mobile-menu"
          className={`md:hidden border-t bg-white transition-max-height duration-200 ease-in-out overflow-hidden ${mobileOpen ? "max-h-96" : "max-h-0"}`}
        >
          <div className="px-4 pt-3 pb-4 space-y-2">
            {authUser ? (
              <>
                <div className="px-2 py-2 rounded-md">
                  <span className="text-sm text-gray-600">Welcome,</span>
                  <div className="text-sm font-medium text-gray-900">{authUser.username}</div>
                </div>



                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="px-3 py-2 text-sm text-green-600 hover:text-white hover:bg-green-600 transition  focus:ring-2 focus:ring-green-200 border-1 mx-3"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2  text-base text-green-600 hover:text-green-700 hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="block px-3 py-2 text-green-600 hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
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