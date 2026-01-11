import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import { useState, useEffect } from "react";
import API from "../api/axios";

function Sidebar({ user, suggestions }) {
  const [open, setOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(true);

  const safeUser = user || {};
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  const fileURL = (path) => {
    if (!path || path === "null" || path === "undefined")
      return "/default_dp.png"; // from frontend public folder

    // remove leading slash
    let clean = path.replace(/^\/+/, "");

    // ensure uploads/ is included
    if (!clean.startsWith("uploads/")) clean = "uploads/" + clean;

    return `http://localhost:5000/${clean}`;
  };

  /* ---------------- AUTO-HIDE SIDEBAR BUTTON ON SCROLL ----------------*/
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (open) return;

      if (window.scrollY > lastScrollY) {
        setShowToggle(false);
      } else {
        setShowToggle(true);
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  /* Disable background scroll when sidebar open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      {!open && showToggle && (
        <div className="sidebar-toggle" onClick={() => setOpen(true)}>
          ☰
        </div>
      )}

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>

        {/* USER INFO */}
        <div className="sidebar-user-box">
          <img
            src={fileURL(safeUser.dp)}
            className="sidebar-user-dp"
            alt="dp"
          />

          <div>
            <p className="sb-username">@{safeUser.username || "guest"}</p>

            {safeUser._id && (
              <Link to={`/profile/${safeUser._id}`} className="sb-view">
                View Profile
              </Link>
            )}
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="sidebar-menu">
          <Link to="/feed">🏠 Home</Link>
          <Link to="/create">➕ Create</Link>
          <Link to="/users">👥 People</Link>

          {safeUser._id && (
            <Link to={`/profile/${safeUser._id}`}>👤 Profile</Link>
          )}
        </nav>

        {/* SUGGESTIONS */}
        <div className="sidebar-suggest">
          <h3>Suggested</h3>

          {safeSuggestions.length === 0 && (
            <p className="no-suggest">No suggestions</p>
          )}

          {safeSuggestions.map((s) => (
            <div key={s._id} className="side-suggest-user">
              <img
                src={fileURL(s.dp)}
                className="side-suggest-dp"
                alt="dp"
              />
              <p>@{s.username}</p>
              <Link to={`/profile/${s._id}`} className="side-follow-btn">
                View
              </Link>
            </div>
          ))}
        </div>

        {/* SETTINGS */}
        <div className="sidebar-footer">
          {safeUser._id && (
            <Link to={`/profile/${safeUser._id}`} className="settings-btn">
              ⚙ Settings
            </Link>
          )}
        </div>

      </aside>
    </>
  );
}

export default Sidebar;
