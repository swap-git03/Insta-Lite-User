import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import { useState, useEffect } from "react";

function Sidebar({ user, suggestions }) {
  const [open, setOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(true);

  const safeUser = user || {};
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  /* ============================
     HIDE BUTTON ON SCROLL 
  ============================ */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (open) return; // don't hide when sidebar open

      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setShowToggle(false);
      } else {
        // scrolling up → show
        setShowToggle(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);


  /* ============================
     DISABLE BACKGROUND SCROLL 
  ============================ */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        
        {/* USER BOX */}
        <div className="sidebar-user-box">
          <img
            src={
              safeUser.dp
                ? `http://localhost:5000/${safeUser.dp}`
                : "/default.png"
            }
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

        {/* MENU */}
        <nav className="sidebar-menu">
          <Link to="/feed">🏠 Home</Link>
          <Link to="/create">➕ Create</Link>
          <Link to="/users">👥 People</Link>
          {safeUser._id && <Link to={`/profile/${safeUser._id}`}>👤 Profile</Link>}
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
                src={
                  s.dp
                    ? `http://localhost:5000/${s.dp}`
                    : "/default.png"
                }
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
