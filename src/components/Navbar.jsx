/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  if (hideNavbar) return null;

  // Logged user
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const profileLink = user?._id ? `/profile/${user._id}` : "/profile";

  // Navbar hide on scroll (mobile + desktop)
  const [showNav, setShowNav] = useState(true);
  let lastScroll = 0;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.pageYOffset;

      if (current > lastScroll && current > 10) {
        // scrolling DOWN → hide
        setShowNav(false);
      } else {
        // scrolling UP → show
        setShowNav(true);
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, []);

  // SEARCH SYSTEM
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (val) => {
    setSearch(val);

    if (!val.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/search/${val}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className={`nav ${showNav ? "nav-show" : "nav-hide"}`}>
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/feed">
          <img src="/swapinsta-logo.png" className="nav-logo" alt="logo" />
        </Link>
      </div>

      {/* CENTER - SEARCH */}
      <div className="nav-center">
        <input
          type="text"
          placeholder="Search"
          className="nav-search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* SEARCH DROPDOWN */}
        {results.length > 0 && (
          <div className="search-results">
            {results.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                className="search-item"
                onClick={() => {
                  setSearch("");
                  setResults([]);
                }}
              >
                <img
                  src={
                    u.dp ? `http://localhost:5000/${u.dp}` : "/default.png"
                  }
                  alt="dp"
                />
                <span>{u.username}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <Link to="/feed" className="nav-icon">
          <i className="bi bi-house-door"></i>
        </Link>

        <Link to="/create" className="nav-icon">
          <i className="bi bi-plus-square"></i>
        </Link>

        <Link to="/users" className="nav-icon">
          <i className="bi bi-people-fill"></i>
        </Link>

        <Link to={profileLink} className="nav-icon">
          {user?.dp ? (
            <img
              src={
                user.dp.startsWith("http")
                  ? user.dp
                  : `http://localhost:5000/${user.dp}`
              }
              className="nav-dp"
              alt="dp"
            />
          ) : (
            <i className="bi bi-person-circle"></i>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
